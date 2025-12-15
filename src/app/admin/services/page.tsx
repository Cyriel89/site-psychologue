import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import ServicesClient from "./ServicesClient";

export default async function AdminServicesPage() {
  await requireAdminOrSupport();

  const servicesDb = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { image: { select: { id: true, url: true, alt: true } } },
  });

  // Mapper DB -> Client (Notamment pour Decimal -> string)
  const services = servicesDb.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    iconKey: s.iconKey ?? undefined,
    audience: s.audience as "INDIVIDUAL" | "COMPANY",
    shortDescription: s.shortDescription,
    longDescription: s.longDescription,
    priceType: s.priceType as "FIXED" | "QUOTE",
    priceAmount: s.priceAmount?.toString() ?? "",
    priceCurrency: s.priceCurrency ?? "€",
    imageId: s.imageId ?? undefined,
    image: s.image,
    visible: s.visible,
    order: s.order,
  }));

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1>
        <p className="text-gray-500 mt-1">
          Ajoutez, modifiez et réorganisez vos prestations pour les particuliers et les entreprises.
        </p>
      </div>

      <ServicesClient initialServices={services} media={media} />
    </div>
  );
}