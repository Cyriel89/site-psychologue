"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type FaqFormData = {
  id?: string;
  question: string;
  answer: string;
  visible: boolean;
  order: number;
};

export async function saveFaqAction(data: FaqFormData) {
  try {
    await requireAdminOrSupport();

    if (data.id) {
      await prisma.faq.update({
        where: { id: data.id },
        data: {
          question: data.question,
          answer: data.answer,
          visible: data.visible,
          order: data.order,
        },
      });
    } else {
      await prisma.faq.create({
        data: {
          question: data.question,
          answer: data.answer,
          visible: data.visible,
          order: data.order,
        },
      });
    }

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, message: "FAQ mise à jour." };

  } catch (error) {
    console.error("Erreur saveFaq:", error);
    return { success: false, message: "Erreur lors de la sauvegarde." };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await requireAdminOrSupport();
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/admin/faq");
    return { success: true, message: "Question supprimée." };
  } catch (error) {
    return { success: false, message: "Impossible de supprimer." };
  }
}

export async function reorderFaqAction(orderedIds: string[]) {
  try {
    await requireAdminOrSupport();

    const updates = orderedIds.map((id, index) =>
      prisma.faq.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath("/admin/faq");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erreur de tri." };
  }
}