import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/services/delete error", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}