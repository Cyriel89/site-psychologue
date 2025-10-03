import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

    const { id } = (await req.json()) as { id?: string };
    if (!id) return err("id manquant");

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return err("Media introuvable", 404);

    // Vérifier qu'il n’est pas référencé (optionnel, rapide)
    const refService = await prisma.service.count({ where: { imageId: id } });
    const refPartner = await prisma.partner.count({ where: { logoId: id } });
    if (refService > 0 || refPartner > 0) {
      return err("Ce média est utilisé par un contenu. Déliez-le avant suppression.");
    }

    // Supprime le fichier du disque si dans /uploads
    if (media.url.startsWith("/uploads/")) {
      const p = path.join(process.cwd(), "public", media.url);
      await fs.unlink(p).catch(() => {});
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/media/delete error", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}