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
    let { id, name, url, description, logoId, visible } = body as {
      id?: string;
      name: string;
      url: string | null;
      description: string | null;
      logoId: string | null;
      visible: boolean;
    };

    if (!name?.trim()) return err("Nom requis");

    // Calcul de l'ordre côté serveur si création
    let order: number;
    if (!id) {
      const max = await prisma.partner.aggregate({ _max: { order: true } });
      order = (max._max.order ?? -1) + 1;
    } else {
      // conserver l'ordre existant
      const prev = await prisma.partner.findUnique({ where: { id } });
      order = prev?.order ?? 0;
    }

    const data = {
      name: name.trim(),
      url: url || null,
      description: description || null,
      logoId: logoId || null,
      visible: !!visible,
      order,
    };

    const saved = id
      ? await prisma.partner.update({
          where: { id },
          data,
          include: { logo: true },
        })
      : await prisma.partner.create({
          data,
          include: { logo: true },
        });

    return NextResponse.json({ ok: true, partner: saved });
  } catch (e) {
    console.error("POST /api/admin/partners/save error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}