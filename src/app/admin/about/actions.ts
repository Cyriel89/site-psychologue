"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

type AboutData = {
  title: string;
  goal: string;
  mission: string;
  presentation: string;
};

export async function updateAboutAction(data: AboutData) {
  try {
    await requireAdminOrSupport();

    const aboutJson = {
      title: data.title,
      goal: data.goal,
      mission: data.mission,
      presentation: data.presentation,
    };

    await prisma.setting.upsert({
      where: { id: "global" },
      update: {
        about: aboutJson,
      },
      create: {
        id: "global",
        about: aboutJson,
      },
    });

    revalidatePath("/admin/about");
    revalidatePath("/");
    revalidatePath("/about");

    return { success: true, message: "Section À Propos mise à jour !" };

  } catch (error) {
    console.error("Erreur updateAboutAction:", error);
    return { success: false, message: "Erreur serveur lors de la sauvegarde." };
  }
}