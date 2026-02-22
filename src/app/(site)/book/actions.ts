"use server";

import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/bookingEngine";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session"; 

export type BookingData = {
  serviceId: string;
  date: Date;
  time: string;
  notes?: string; 
  format: "FACE_TO_FACE" | "VISIO";
};

// FONCTION 1 : Récupérer les créneaux disponibles
export async function getSlotsAction(dateStr: string, serviceId: string) {
  try {
    if (!dateStr || !serviceId) return { success: false, slots: [] };

    const date = new Date(dateStr);
    
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) return { success: false, message: "Service introuvable" };

    const slots = await getAvailableSlots(date, service.duration);

    return { success: true, slots };
  } catch (error) {
    console.error("Erreur getSlots:", error);
    return { success: false, message: "Impossible de récupérer les créneaux." };
  }
}

// FONCTION 2 : Créer le rendez-vous
export async function createAppointmentAction(data: BookingData) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, message: "Vous devez être connecté pour réserver." };
    }

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service) return { success: false, message: "Service introuvable." };

    const [hours, minutes] = data.time.split(":").map(Number);
    const startDateTime = new Date(data.date);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration);

    await prisma.appointment.create({
      data: {
        userId: session.userId, 
        serviceId: service.id,
        startAt: startDateTime, // Ou startAt selon ton schéma Prisma final
        endAt: endDateTime,     // Ou endAt
        price: service.priceAmount || 0,
        status: "CONFIRMED", 
        notes: data.notes,      // Ou notes
        format: data.format
      },
    });

    revalidatePath("/admin/appointments");
    revalidatePath("/account/appointments");
    
    return { success: true, message: "Rendez-vous confirmé !" };

  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, message: "Erreur lors de la réservation." };
  }
}