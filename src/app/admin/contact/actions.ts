"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type ContactFormData = {
  title: string;
  intro: string;
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  booking: string;
};

export async function saveContactAction(data: ContactFormData) {
  try {
    await requireAdminOrSupport();

    const contactJson = {
      title: data.title,
      intro: data.intro,
      email: data.email,
      phone: data.phone,
      address: data.address,
      openingHours: data.openingHours,
      booking: data.booking,
    };

    await prisma.setting.upsert({
      where: { id: "global" },
      update: {
        contact: contactJson,
      },
      create: {
        id: "global",
        contact: contactJson,
      },
    });

    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    
    return { success: true, message: "Page Contact mise à jour." };

  } catch (error) {
    console.error("Erreur saveContact:", error);
    return { success: false, message: "Erreur serveur lors de la sauvegarde." };
  }
}