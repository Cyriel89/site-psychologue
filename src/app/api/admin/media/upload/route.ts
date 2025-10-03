import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // Auth
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return err("Unauthorized", 401);
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const alt = (form.get("alt") as string | null)?.trim() || null;

    if (!file) return err("Aucun fichier reçu");

    // Limites basiques
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return err("Type de fichier non autorisé");
    }
    if (file.size > 5 * 1024 * 1024) {
      return err("Fichier trop volumineux (5 Mo max)");
    }

    // Dossier cible
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Nom de fichier unique
    const ext = file.name.split(".").pop() || "bin";
    const base = crypto.randomBytes(16).toString("hex");
    const filename = `${base}.${ext}`;

    // Ecriture disque
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(arrayBuffer));

    // URL publique
    const url = `/uploads/${filename}`;

    // Enregistrement en BDD
    const media = await prisma.media.create({
      data: { url, alt },
    });

    return NextResponse.json({ ok: true, media });
  } catch (e) {
    console.error("POST /api/admin/media/upload error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}