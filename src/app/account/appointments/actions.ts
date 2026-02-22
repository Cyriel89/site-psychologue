/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { differenceInHours } from "date-fns";

// Vérifie si on a le droit d'agir sur ce RDV (< 48h)
async function verifyOwnershipAndDeadline(appointmentId: string, userId: string) {
  const apt = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true }
  });

  if (!apt || apt.userId !== userId) {
    throw new Error("Rendez-vous introuvable ou non autorisé.");
  }

  const hoursLeft = differenceInHours(new Date(apt.startAt), new Date());
  if (hoursLeft < 48) {
    throw new Error("Modification impossible à moins de 48h de la séance.");
  }

  return apt;
}

export async function cancelAppointmentAction(appointmentId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return { success: false, message: "Non autorisé" };

    await verifyOwnershipAndDeadline(appointmentId, session.userId);

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/account/rdv");
    revalidatePath("/admin/appointments");
    return { success: true, message: "Séance annulée avec succès." };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur lors de l'annulation." };
  }
}

export async function updateAppointmentAction(
  appointmentId: string, 
  data: { format: "FACE_TO_FACE" | "VISIO"; notes: string; newDate?: Date; newTime?: string }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return { success: false, message: "Non autorisé" };

    const apt = await verifyOwnershipAndDeadline(appointmentId, session.userId);

    // Préparation des données à mettre à jour
    const updateData: any = {
      format: data.format,
      notes: data.notes,
    };

    // Si le patient a choisi une nouvelle date/heure
    if (data.newDate && data.newTime) {
      const [hours, minutes] = data.newTime.split(":").map(Number);
      const startDateTime = new Date(data.newDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + apt.service.duration);

      updateData.startAt = startDateTime;
      updateData.endAt = endDateTime;
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });

    revalidatePath("/account/rdv");
    revalidatePath("/admin/appointments");
    return { success: true, message: "Séance mise à jour avec succès." };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur lors de la mise à jour." };
  }
}