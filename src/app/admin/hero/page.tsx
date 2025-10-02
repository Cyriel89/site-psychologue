// src/app/admin/hero/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminHeroPage() {
  const user = await requireAdminOrSupport();
  if (!user) return null; // layout redirige déjà si pas d’accès

  const setting = await prisma.setting.findUnique({
    where: { id: "global" },
    include: { heroImage: true },
  });

  const heroJson = (setting?.hero as any) ?? {};
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true },
  });

  const initial = {
    name: heroJson.name ?? "",
    title: heroJson.title ?? "",
    subtitle: heroJson.subtitle ?? "",
    ctaLabel: heroJson.cta?.label ?? "",
    ctaHref: heroJson.cta?.href ?? "",
    heroImageId: setting?.heroImageId ?? "",
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Éditer la section Hero</h1>
      <HeroForm initial={initial} media={media} />
    </div>
  );
}
