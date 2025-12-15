import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import { buildSessionToken } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { ok: false, error: "Ce compte a été désactivé." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { ok: false, error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const payload = {
      userId: user.id,
      role: user.role, 
    };

    await buildSessionToken(payload);

    return NextResponse.json({
      ok: true,
      role: user.role, // "ADMIN" ou "CLIENT"
      message: "Connexion réussie",
    });

  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}