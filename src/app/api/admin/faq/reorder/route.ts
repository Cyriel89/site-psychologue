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

    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) return err("Payload invalide.");

    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.faq.update({ where: { id }, data: { order: index } })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/faq/reorder", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}