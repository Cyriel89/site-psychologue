"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type PartnerFormData = {
  id?: string;
  name: string;
  url: string;
  description: string;
  logoId?: string | null;
  visible: boolean;
  order: number;
};

export async function savePartnerAction(data: PartnerFormData) {
  try {
    await requireAdminOrSupport();

    const payload = {
      name: data.name,
      url: data.url || null,
      description: data.description || null,
      logoId: data.logoId || null, // Convertit "" en null
      visible: data.visible,
      order: data.order,
    };

    if (data.id) {
      await prisma.partner.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      await prisma.partner.create({
        data: payload,
      });
    }

    revalidatePath("/admin/partners");
    revalidatePath("/");
    return { success: true, message: "Partenaire enregistré." };
  } catch (error) {
    console.error("Erreur savePartner:", error);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  }
}

export async function deletePartnerAction(id: string) {
  try {
    await requireAdminOrSupport();
    await prisma.partner.delete({ where: { id } });
    revalidatePath("/admin/partners");
    return { success: true, message: "Partenaire supprimé." };
  } catch (error) {
    return { success: false, message: "Impossible de supprimer." };
  }
}

export async function reorderPartnersAction(orderedIds: string[]) {
  try {
    await requireAdminOrSupport();
    
    const updates = orderedIds.map((id, index) =>
      prisma.partner.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath("/admin/partners");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erreur de tri." };
  }
}