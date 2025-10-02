// src/app/api/admin/hero/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // auth
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, subtitle, ctaLabel, ctaHref, heroImageId } = body as {
      name: string;
      title: string;
      subtitle?: string;
      ctaLabel?: string;
      ctaHref?: string;
      heroImageId?: string | null;
    };

    if (!name || !title) {
      return NextResponse.json({ message: "Champs requis manquants." }, { status: 400 });
    }

    // Met à jour le JSON hero + la FK d'image
    const updated = await prisma.setting.update({
      where: { id: "global" },
      data: {
        hero: {
          name,
          title,
          subtitle: subtitle ?? "",
          cta: { label: ctaLabel ?? "", href: ctaHref ?? "" },
        },
        heroImageId: heroImageId || null,
      },
      include: { heroImage: true },
    });

    return NextResponse.json({ ok: true, setting: updated });
  } catch (e) {
    console.error("POST /api/admin/hero error", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
