import { prisma } from "@/lib/prisma";
import AdminLocation from "./AdminLocation";

export const dynamic = "force-dynamic";

type OpeningHours = {
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
};

type RawOpeningHour = { day: string; hours: string };

function normalizeOpeningHours(json: unknown): OpeningHours {
  const defaultHours: OpeningHours = {
    Lundi: "",
    Mardi: "",
    Mercredi: "",
    Jeudi: "",
    Vendredi: "",
    Samedi: "",
    Dimanche: "",
  };

  if (!Array.isArray(json)) {
    return defaultHours;
  }
 
  const rawHours = json as RawOpeningHour[];
  const mappedHours: Partial<OpeningHours> = {};

  rawHours.forEach(item => {
    const day = item.day as keyof OpeningHours;
    if (day && typeof item.hours === 'string') {
      mappedHours[day] = item.hours;
    }
  });

  return { ...defaultHours, ...mappedHours };
}

export default async function AdminLocationPage() {
  const loc = await prisma.location.findUnique({ where: { id: "primary" } });

  const initial = {
    id: loc?.id ?? "primary",
    title: loc?.title ?? "Où me trouver ?",
    subtitle: loc?.subtitle ?? "",
    addressLine1: loc?.addressLine1 ?? "",
    addressLine2: loc?.addressLine2 ?? "",
    postalCode: loc?.postalCode ?? "",
    city: loc?.city ?? "",
    country: loc?.country ?? "France",
    latitude: loc?.latitude ?? 47.2166,
    longitude: loc?.longitude ?? -1.55133,
    mapUrl: loc?.mapUrl ?? "",
    notes: loc?.notes ?? "",
    openingHours: normalizeOpeningHours(loc?.openingHours),
  };

  return <AdminLocation initial={initial} />;
}