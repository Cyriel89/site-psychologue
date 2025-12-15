import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import PartnersClient from "./PartnersClient";

export default async function AdminPartnersPage() {
  await requireAdminOrSupport();

  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { logo: { select: { id: true, url: true, alt: true } } },
  });

  const mappedPartners = partners.map((p) => ({
    id: p.id,
    name: p.name,
    url: p.url ?? "",
    description: p.description ?? "",
    logoId: p.logoId ?? "",
    logo: p.logo,
    visible: p.visible,
    order: p.order,
  }));

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1>
        <p className="text-gray-500 mt-1">
          Affichez les logos et liens de vos réseaux, partenaires institutionnels ou associatifs.
        </p>
      </div>

      <PartnersClient initialPartners={mappedPartners} media={media} />
    </div>
  );
}