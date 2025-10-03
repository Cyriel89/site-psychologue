// src/app/admin/location/page.tsx
import { prisma } from "@/lib/prisma";
import AdminLocation from "./AdminLocation";

export const dynamic = "force-dynamic";

export default async function LocationAdminPage() {
  // Singleton id = "primary"
  const loc = await prisma.location.findUnique({
    where: { id: "primary" },
  });

  // s'il n'existe pas encore, on crée une base en DB (safe)
  const initial =
    loc ??
    (await prisma.location.create({
      data: {
        id: "primary",
        title: "Où me trouver ?",
        subtitle: "Je vous reçois dans mon cabinet à Nantes.",
        addressLine1: "16 rue de Strasbourg",
        city: "Nantes",
        postalCode: "44000",
        country: "France",
        latitude: 47.2166,
        longitude: -1.55133,
        mapUrl: "https://maps.app.goo.gl/...",
      },
    }));

  return <AdminLocation initial={initial} />;
}