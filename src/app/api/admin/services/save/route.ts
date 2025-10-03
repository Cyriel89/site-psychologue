// src/app/api/admin/services/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}
function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return "Server error"; }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = parseSessionFromToken(token);
    if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
      return err("Unauthorized", 401);
    }

    const body = await req.json();
    let {
      id,
      title,
      slug,
      iconKey,
      audience,          // "INDIVIDUAL" | "COMPANY"
      shortDescription,
      longDescription,
      priceType,         // "FIXED" | "QUOTE"
      priceAmount,       // string | null
      priceCurrency,     // string | null
      imageId,           // string | null
      visible,           // boolean
      order,             // number
    } = body;

    // --- validations minimales ---
    if (!title?.trim()) return err("Titre requis");
    if (!slug?.trim()) return err("Slug requis");
    if (audience !== "INDIVIDUAL" && audience !== "COMPANY") {
      return err("Audience invalide (INDIVIDUAL | COMPANY)");
    }
    if (!shortDescription?.trim()) return err("Description courte requise");
    if (!longDescription?.trim()) return err("Description longue requise");
    if (priceType !== "FIXED" && priceType !== "QUOTE") {
      return err("Type de prix invalide (FIXED | QUOTE)");
    }

    // --- Prix (string) ---
    if (priceType === "FIXED") {
      if (typeof priceAmount !== "string" || priceAmount.trim() === "") {
        return err("Montant requis pour un prix fixe");
      }
      const normalized = priceAmount.trim().replace(",", ".");
      if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
        return err("Montant invalide. Format attendu : 60 ou 60.50");
      }
      priceAmount = normalized;
      priceCurrency = priceCurrency || "€";
    } else {
      priceAmount = null;
      priceCurrency = null;
    }

    imageId = imageId || null;

    // Récupérer l'ancien service si update
    const prev = id ? await prisma.service.findUnique({ where: { id } }) : null;

    // Si création → calculer order = fin de l’audience
    if (!id) {
      const max = await prisma.service.aggregate({
        where: { audience },
        _max: { order: true },
      });
      order = typeof order === "number" ? order : (max._max.order ?? -1) + 1;
    }

    // Si update ET audience change → mettre à la fin de la nouvelle audience
    if (id && prev && prev.audience !== audience) {
      const max = await prisma.service.aggregate({
        where: { audience },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }

    const data: any = {
      title: title.trim(),
      slug: slug.trim(),
      iconKey: iconKey || null,
      audience,
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim(),
      priceType,
      priceAmount,
      priceCurrency,
      imageId,
      visible: !!visible,
      order: Number.isFinite(order) ? Number(order) : 0,
    };

    const saved = id
      ? await prisma.service.update({
          where: { id },
          data,
          include: { image: true },
        })
      : await prisma.service.create({
          data,
          include: { image: true },
        });

    return NextResponse.json({ ok: true, service: saved });
  } catch (e) {
    console.error("POST /api/admin/services/save error", e);
    return NextResponse.json({ ok: false, message: toErrorMessage(e) }, { status: 500 });
  }
}