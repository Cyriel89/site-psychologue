"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidatePath } from "next/cache";

type HeroData = {
  name: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  heroImageId: string | null;
};

export async function updateHeroAction(data: HeroData) {
  try {
    await requireAdminOrSupport();

    const heroJson = {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      cta: {
        label: data.ctaLabel,
        href: data.ctaHref,
      },
    };

    await prisma.setting.upsert({
      where: { id: "global" },
      update: {
        hero: heroJson,
        heroImageId: data.heroImageId || null,
      },
      create: {
        id: "global",
        hero: heroJson,
        heroImageId: data.heroImageId || null,
      },
    });

    revalidatePath("/admin/hero"); // maj form
    revalidatePath("/");           // maj site public

    return { success: true, message: "Mise à jour réussie !" };

  } catch (error) {
    console.error("Erreur updateHeroAction:", error);
    return { success: false, message: "Une erreur est survenue lors de la sauvegarde." };
  }
}