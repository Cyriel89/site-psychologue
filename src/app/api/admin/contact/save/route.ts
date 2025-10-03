// src/app/api/admin/contact/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // Auth (ADMIN ou SUPPORT)
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return err("Unauthorized", 401);
    }

    const { contact } = await req.json();

    // Whitelist stricte des champs éditables
    const safe = {
      title:        String(contact?.title ?? ""),
      intro:        String(contact?.intro ?? ""),
      email:        String(contact?.email ?? ""),
      phone:        String(contact?.phone ?? ""),
      address:      String(contact?.address ?? ""),
      openingHours: String(contact?.openingHours ?? ""),
      booking:      String(contact?.booking ?? ""),
    };

    await prisma.setting.upsert({
      where: { id: "global" },
      create: { id: "global", contact: safe },
      update: { contact: safe },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/contact/save error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}