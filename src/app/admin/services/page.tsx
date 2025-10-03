// src/app/admin/services/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import AdminServices from "./AdminServices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminServicesPage() {
  const user = await requireAdminOrSupport();
  if (!user) return null;

  const servicesDb = await prisma.service.findMany({
    // 🔁 DB = `order`, pas `sortOrder`
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { image: { select: { id: true, url: true, alt: true } } },
  });

  // ✅ Map DB -> UI
  const services = servicesDb.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    iconKey: s.iconKey ?? null,
    audience: s.audience as "INDIVIDUAL" | "COMPANY",
    shortDescription: s.shortDescription,
    longDescription: s.longDescription,
    priceType: s.priceType as "FIXED" | "QUOTE",
    priceAmount: s.priceAmount ?? null, // si Decimal, tu peux toString() si besoin
    priceCurrency: s.priceCurrency ?? null,
    imageId: s.imageId ?? null,
    image: s.image ? { id: s.image.id, url: s.image.url, alt: s.image.alt } : null,
    visible: s.visible,
    order: s.order
  }));

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Services — Administration</h1>
      <AdminServices initialServices={services} media={media} />
    </div>
  );
}