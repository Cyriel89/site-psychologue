import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import HeroForm from "./HeroForm";

export default async function AdminHeroPage() {
  await requireAdminOrSupport();

  const setting = await prisma.setting.findUnique({
    where: { id: "global" },
  });

  const heroJson = (setting?.hero as any) ?? {};

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true },
  });

  const initialData = {
    name: heroJson.name ?? "",
    title: heroJson.title ?? "",
    subtitle: heroJson.subtitle ?? "",
    ctaLabel: heroJson.cta?.label ?? "",
    ctaHref: heroJson.cta?.href ?? "",
    heroImageId: setting?.heroImageId ?? "",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Section Hero (Accueil)</h1>
        <p className="text-gray-500 mt-1">
          Personnalisez la grande bannière visible tout en haut de votre page d'accueil.
        </p>
      </div>

      <HeroForm initial={initialData} media={media} />
    </div>
  );
}