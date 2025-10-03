import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // Auth
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return err("Unauthorized", 401);
    }

    const body = await req.json();

    const {
      id,
      title,
      subtitle,
      addressLine1,
      addressLine2,
      postalCode,
      city,
      country,
      latitude,
      longitude,
      mapUrl,
      notes,
      openingHours,
    } = body;

    // Validations minimales
    if (!title?.trim()) return err("Titre requis");
    if (!addressLine1?.trim()) return err("Adresse (ligne 1) requise");
    if (!postalCode?.trim()) return err("Code postal requis");
    if (!city?.trim()) return err("Ville requise");
    if (!country?.trim()) return err("Pays requis");
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return err("Coordonnées (lat/lon) invalides");
    }

    // Normalisation openingHours → tableau d'objets {day, hours}
    const normalizedOH =
      Array.isArray(openingHours)
        ? openingHours
            .map((x: any) => ({
              day: typeof x?.day === "string" ? x.day : "",
              hours: typeof x?.hours === "string" ? x.hours : "",
            }))
            .filter((x: any) => x.day && x.hours) // on garde uniquement les lignes complètes
        : [];

    const data = {
      id: id || "primary",
      title: title.trim(),
      subtitle: (subtitle ?? "").toString(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2 ?? null,
      postalCode: postalCode.trim(),
      city: city.trim(),
      country: country.trim(),
      latitude,
      longitude,
      mapUrl: mapUrl ?? null,
      notes: notes ?? null,
      openingHours: normalizedOH as unknown as object,
    };

    const saved = await prisma.location.upsert({
      where: { id: id || "primary" },
      create: data,
      update: data,
    });

    return NextResponse.json({ ok: true, location: saved });
  } catch (e) {
    console.error("POST /api/admin/location/save error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}