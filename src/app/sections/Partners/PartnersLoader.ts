import { prisma } from "@/lib/prisma";

export type PartnerData = {
    id: string;
    name: string;
    url: string | null;
    description: string | null;
    logoUrl: string | null;
    logoAlt: string | null;
};

export async function getPartners(): Promise <PartnerData[]> {
    const rows = await prisma.partner.findMany({
        where: { visible: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: { logo: true },
    });

    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.url,
        description: p.description,
        logoUrl: p.logo?.url ?? "/images/placeholder-partner.jpg",
        logoAlt: p.logo?.alt ?? p.name,
    }));
}