"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type ServiceFormData = {
  id?: string;
  title: string;
  slug: string;
  iconKey?: string | null;
  audience: "INDIVIDUAL" | "COMPANY";
  shortDescription: string;
  longDescription: string;
  priceType: "FIXED" | "QUOTE";
  priceAmount?: string | null;
  priceCurrency?: string | null;
  imageId?: string | null;
  visible: boolean;
  order: number;
};

export async function saveServiceAction(data: ServiceFormData) {
  try {
    await requireAdminOrSupport();

    const payload = {
      title: data.title,
      slug: data.slug,
      iconKey: data.iconKey || null,
      audience: data.audience,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      priceType: data.priceType,
      priceAmount: data.priceAmount || null,
      priceCurrency: data.priceCurrency || "€",
      imageId: data.imageId || null,
      visible: data.visible,
      order: data.order,
    };

    if (data.id) {
      await prisma.service.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      await prisma.service.create({
        data: payload,
      });
    }

    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, message: "Service enregistré avec succès." };
  } catch (error) {
    console.error("Erreur saveServiceAction:", error);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await requireAdminOrSupport();
    await prisma.service.delete({ where: { id } });
    
    revalidatePath("/admin/services");
    return { success: true, message: "Service supprimé." };
  } catch (error) {
    return { success: false, message: "Impossible de supprimer ce service." };
  }
}

export async function reorderServicesAction(orderedIds: string[]) {
  try {
    await requireAdminOrSupport();

    const updates = orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Erreur reorder:", error);
    return { success: false, message: "Erreur de tri." };
  }
}