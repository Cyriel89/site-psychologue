import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { ok: false, error: "Tous les champs obligatoires (Nom, Prénom, Email, Mot de passe) doivent être remplis." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "Cet email est déjà utilisé." },
        { status: 409 } // Conflit
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null, // Optionnel
        role: "CLIENT",
        isActive: true,
      },
    });

    await createSession({
      userId: newUser.id,
      role: newUser.role,
    });

    return NextResponse.json({ ok: true, role: newUser.role });

  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}