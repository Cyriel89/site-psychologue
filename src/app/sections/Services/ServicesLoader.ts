import  { prisma } from "@/lib/prisma";
import { PriceType, ServiceAudience } from "@prisma/client";

export type ServiceData = {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    iconKey: string;
    audience: "INDIVIDUAL" | "COMPANY" | "EMPLOYEE";
    priceType: "FIXED" | "QUOTE";
    priceAmount: string | null;
    priceCurrency: string | null;
    priceLabel: string | null;
    imageUrl: string;
    imageAlt: string;

};

export async function getServices(): Promise<{
  individual: ServiceData[];
  company: ServiceData[];
}> {
    const rows = await prisma.service.findMany({
        where: { visible: true },
        orderBy: [{ audience: 'asc'}, { order: 'asc' }, { title: 'asc' }],
        include: { image: true },
    });

    const mapRow = (s: any): ServiceData => {
        const isFixed = s.priceType === PriceType.FIXED;
        const label = s.priceLabel ?? ((isFixed ? (s.priceAmount ? `${s.priceAmount} ${s.priceCurrency}` : "Tarif sur demande") : "Devis sur mesure"));
        
        return {
            id: s.id,
            slug: s.slug,
            title: s.title,
            shortDescription: s.shortDescription,
            longDescription: s.longDescription,
            iconKey: s.iconKey,
            audience: s.audience as "INDIVIDUAL" | "COMPANY",
            priceType: s.priceType as "FIXED" | "QUOTE",
            priceAmount: isFixed ? s.priceAmount : null,
            priceCurrency: isFixed ? s.priceCurrency : null,
            priceLabel: label,
            imageUrl: s.image?.url ?? "/images/placeholder-service.jpg",
            imageAlt: s.image?.alt ?? s.title,
        };
    };

    const individual = rows.filter(r => r.audience === ServiceAudience.INDIVIDUAL).map(mapRow);
    const company = rows.filter(r => r.audience === ServiceAudience.COMPANY).map(mapRow);
    const employee = rows.filter(r => r.audience === ServiceAudience.EMPLOYEE).map(mapRow);

    return {
        individual: [...individual, ...employee],
        company,
    };
}