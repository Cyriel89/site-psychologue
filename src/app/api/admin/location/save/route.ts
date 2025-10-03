// src/app/api/admin/location/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return err("Unauthorized", 401);
    }

    const body = await req.json();
    const {
      id, title, subtitle, addressLine1, addressLine2, city, postalCode, country,
      latitude, longitude, mapUrl, notes
    } = body;

    if (id !== "primary") {
      // On force le singleton
      return err("Invalid id", 400);
    }
    if (!title?.trim() || !addressLine1?.trim() || !city?.trim() || !postalCode?.trim() || !country?.trim()) {
      return err("Champs obligatoires manquants.");
    }

    await prisma.location.update({
      where: { id: "primary" },
      data: {
        title: title.trim(),
        subtitle: subtitle ?? null,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim() || null,
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        mapUrl: mapUrl?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/location/save error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}