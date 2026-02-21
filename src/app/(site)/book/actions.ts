"use server";

import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/bookingEngine";
import { revalidatePath } from "next/cache";

// Type pour les données du formulaire client
export type BookingData = {
  serviceId: string;
  date: Date;     // L'objet Date du calendrier
  time: string;   // "09:30"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note?: string;
};

export async function getSlotsAction(dateStr: string, serviceId: string) {
  try {
    // 1. Validation basique
    if (!dateStr || !serviceId) return { success: false, slots: [] };

    const date = new Date(dateStr);
    
    // 2. Récupérer la durée du service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) return { success: false, message: "Service introuvable" };

    // 3. Calculer les slots via notre moteur
    const slots = await getAvailableSlots(date, service.duration);

    return { success: true, slots };
  } catch (error) {
    console.error("Erreur getSlots:", error);
    return { success: false, message: "Impossible de récupérer les créneaux." };
  }
}

export async function createAppointmentAction(data: BookingData) {
  try {
    // 1. Récupérer le service pour avoir la durée et le prix
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service) return { success: false, message: "Service introuvable." };

    // 2. Construire la date de début et de fin
    const [hours, minutes] = data.time.split(":").map(Number);
    const startDateTime = new Date(data.date);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration);

    // 3. Gestion du Client (User)
    // On cherche si un user existe déjà avec cet email, sinon on le crée
    // Note: Pour un vrai auth, on enverrait un email de confirmation ici.
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      create: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "CLIENT",
      },
    });

    // 4. Créer le RDV
    await prisma.appointment.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        startAt: startDateTime,
        endAt: endDateTime,
        price: service.priceAmount || 0, // On fige le prix
        status: "CONFIRMED", // Ou "PENDING" si tu veux valider manuellement
        notes: data.note
      },
    });

    // 5. Revalidation (optionnel si c'est public, mais utile pour l'admin)
    revalidatePath("/admin/appointments");
    
    return { success: true, message: "Rendez-vous confirmé !" };

  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, message: "Erreur lors de la réservation." };
  }
}