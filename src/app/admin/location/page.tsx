import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import LocationForm from "./LocationForm";
import { OpeningHoursData } from "./actions";

function normalizeOpeningHours(json: unknown): OpeningHoursData {
  const defaultHours: OpeningHoursData = {
    Lundi: "", Mardi: "", Mercredi: "", Jeudi: "", Vendredi: "", Samedi: "", Dimanche: ""
  };

  if (!Array.isArray(json)) return defaultHours;

  const result = { ...defaultHours };
  json.forEach((item: any) => {
    if (item.day && item.hours && item.day in result) {
      // @ts-ignore
      result[item.day] = item.hours;
    }
  });

  return result;
}

export default async function AdminLocationPage() {
  await requireAdminOrSupport();

  const loc = await prisma.location.findUnique({ where: { id: "primary" } });

  const initial = {
    title: loc?.title ?? "Où me trouver ?",
    subtitle: loc?.subtitle ?? "",
    addressLine1: loc?.addressLine1 ?? "",
    addressLine2: loc?.addressLine2 ?? "",
    postalCode: loc?.postalCode ?? "",
    city: loc?.city ?? "",
    country: loc?.country ?? "France",
    latitude: loc?.latitude?.toString() ?? "47.218",
    longitude: loc?.longitude?.toString() ?? "-1.553",
    mapUrl: loc?.mapUrl ?? "",
    notes: loc?.notes ?? "",
    openingHours: normalizeOpeningHours(loc?.openingHours),
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lieu & Horaires</h1>
        <p className="text-gray-500 mt-1">
          Ces informations apparaîtront dans le pied de page et sur la page Contact.
        </p>
      </div>

      <LocationForm initial={initial} />
    </div>
  );
}