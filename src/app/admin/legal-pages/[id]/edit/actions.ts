"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

export type PageFormData = {
  id: string;
  title: string;
  content: string;
};

export async function savePageDraftAction(data: PageFormData) {
  try {
    const user = await requireAdminOrSupport();

    await prisma.pageRevision.create({
      data: {
        pageId: data.id,
        title: data.title,
        content: data.content,
        status: "DRAFT",
      },
    });

    await prisma.page.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        status: "DRAFT",
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/admin/legal-pages/${data.id}/edit`);
    return { success: true, message: "Brouillon sauvegardé (+ Révision créée)." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur lors de la sauvegarde." };
  }
}

export async function publishPageAction(id: string) {
  try {
    await requireAdminOrSupport();

    await prisma.page.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    revalidatePath(`/admin/legal-pages/${id}/edit`);
    return { success: true, message: "Page publiée en ligne !" };
  } catch (error) {
    return { success: false, message: "Erreur lors de la publication." };
  }
}

export async function unpublishPageAction(id: string) {
  try {
    await requireAdminOrSupport();

    await prisma.page.update({
      where: { id },
      data: { status: "DRAFT" },
    });

    revalidatePath(`/admin/legal-pages/${id}/edit`);
    return { success: true, message: "Page retirée du site (Brouillon)." };
  } catch (error) {
    return { success: false, message: "Erreur." };
  }
}

export async function restoreRevisionAction(pageId: string, revisionId: string) {
  try {
    await requireAdminOrSupport();

    // On récupère la vieille version
    const revision = await prisma.pageRevision.findUnique({ where: { id: revisionId } });
    if (!revision) return { success: false, message: "Révision introuvable." };

    await prisma.page.update({
      where: { id: pageId },
      data: {
        title: revision.title,
        content: revision.content,
        status: "DRAFT",
      },
    });

    revalidatePath(`/admin/legal-pages/${pageId}/edit`);
    return { success: true, message: "Version restaurée (Brouillon)." };
  } catch (error) {
    return { success: false, message: "Erreur lors de la restauration." };
  }
}