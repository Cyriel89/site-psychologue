"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type OpeningHoursData = {
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
};

export type LocationFormData = {
  title: string;
  subtitle: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: string; // On gère en string dans le form, conversion en number ici
  longitude: string;
  mapUrl: string;
  notes: string;
  openingHours: OpeningHoursData;
};

export async function saveLocationAction(data: LocationFormData) {
  try {
    await requireAdminOrSupport();

    // Transformation de l'objet { Lundi: "9h..." } en tableau [{ day: "Lundi", hours: "9h..." }] pour le JSON
    const openingHoursJson = Object.entries(data.openingHours).map(([day, hours]) => ({
      day,
      hours,
    }));

    await prisma.location.upsert({
      where: { id: "primary" },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        mapUrl: data.mapUrl,
        notes: data.notes,
        openingHours: openingHoursJson,
      },
      create: {
        id: "primary",
        title: data.title,
        subtitle: data.subtitle,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        mapUrl: data.mapUrl,
        notes: data.notes,
        openingHours: openingHoursJson,
      },
    });

    revalidatePath("/admin/location");
    revalidatePath("/"); 
    return { success: true, message: "Informations mises à jour." };
  } catch (error) {
    console.error("Erreur saveLocationAction:", error);
    return { success: false, message: "Erreur serveur lors de la sauvegarde." };
  }
}