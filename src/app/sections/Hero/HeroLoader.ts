import { prisma } from "@/lib/prisma";

export type HeroData = {
  name: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
};

type HeroJSON = {
  name?: string;
  title?: string;
  subtitle?: string;
  cta?: { label?: string; href?: string };
};

export async function getHero(): Promise<HeroData> {
  const s = await prisma.setting.findUnique({
    where: { id: "global" },
    include: { heroImage: true }, // ✅ on récupère l'image liée
  });

  const hero = (s?.hero ?? {}) as HeroJSON;

  return {
    name: hero.name ?? "Pauline Diné",
    title: hero.title ?? "Psychologue du travail",
    subtitle: hero.subtitle ?? "Retrouvez équilibre et sérénité au travail",
    cta: {
      label: hero.cta?.label ?? "Prendre rendez-vous",
      href: hero.cta?.href ?? "#contact",
    },
    imageUrl: s?.heroImage?.url ?? "/images/hero.jpg",
    imageAlt: s?.heroImage?.alt ?? "Portrait",
  };
}