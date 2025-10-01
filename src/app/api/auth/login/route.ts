import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import { createSessionCookie } from "@/lib/session";

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

    // Rôle basique: "ADMIN" / "SUPPORT" / "CLIENT"
    createSessionCookie({ userId: user.id, role: user.role });

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
