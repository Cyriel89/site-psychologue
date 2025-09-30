import { prisma } from "@/lib/prisma";

export type OpeningHour = { day: string; hours: string };
export type LocationData = {
    title: string;
    subtitle: string;
    address: string; //ligne formatée pour l'affichage
    cityLine: string; //Ex: "44000 Nantes, France"
    lat: number;
    lon: number;
    mapUrl?: string;
    openingHours: OpeningHour[];
    notes?: string;
};

export async function getLocation(): Promise<LocationData> {
    const loc = await prisma.location.findUnique({ where: { id: "primary"}});
    if (!loc) throw new Error("Location not found");

    return {
        title: loc.title,
        subtitle: loc.subtitle,
        address: [loc.addressLine1, loc.addressLine2].filter(Boolean).join(", "),
        cityLine: `${loc.postalCode} ${loc.city}, ${loc.country}`,
        lat: loc.latitude,
        lon: loc.longitude,
        mapUrl: loc.mapUrl || undefined,
        openingHours: (loc.openingHours as OpeningHour[]) || [],
        notes: loc.notes || undefined,
    };
}