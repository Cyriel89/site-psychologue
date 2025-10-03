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

    const body = await req.json();
    const { id, question, answer, visible, order } = body;

    if (!question?.trim() || !answer?.trim()) {
      return err("Question & réponse requis.");
    }

    const data = {
      question: question.trim(),
      answer: answer.trim(),
      visible: !!visible,
      order: Number.isFinite(order) ? Number(order) : undefined,
    };

    const saved = id
      ? await prisma.faq.update({ where: { id }, data })
      : await prisma.faq.create({
          data: {
            ...data,
            order: typeof data.order === "number" ? data.order : (await prisma.faq.count()),
          },
        });

    return NextResponse.json({ ok: true, faq: saved });
  } catch (e) {
    console.error("POST /api/admin/faq/save", e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}