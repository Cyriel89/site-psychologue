import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import { buildSessionToken, COOKIE_NAME } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "L'e-mail ou le mot de passe est manquant" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "Identifiants invalides" }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Identifiants invalides" }, { status: 401 });
    }
    if (!user.isActive) {
      return NextResponse.json({ message: "Compte désactivé" }, { status: 403 });
    }

    const { token, maxAge } = buildSessionToken({ userId: user.id, role: user.role });

    const res = NextResponse.json({ message: "OK" });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}