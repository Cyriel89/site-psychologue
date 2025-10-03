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

    const { orderedIds } = (await req.json()) as { orderedIds: string[] };
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return err("Payload invalide (orderedIds)");
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.partner.update({ where: { id }, data: { order: index } })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/partners/reorder error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}