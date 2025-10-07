import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminOrSupport } from "@/lib/authServer";
import { PageStatus } from "@prisma/client";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrSupport();
  if (!auth.ok) return auth.response;

  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: page });
}

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrSupport();
  if (!auth.ok) return auth.response;

  const body = await _.json().catch(() => null) as { title?: string; content?: string; status?: "DRAFT" | "PUBLISHED" } | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const title = (body.title ?? "").trim();
  const content = (body.content ?? "").trim();
  const status = body.status === "PUBLISHED" ? PageStatus.PUBLISHED : PageStatus.DRAFT;

  if (title.length < 1 || title.length > 120) return NextResponse.json({ ok: false, error: "Title length invalid" }, { status: 400 });
  if (content.length < 1 || content.length > 80_000) return NextResponse.json({ ok: false, error: "Content length invalid" }, { status: 400 });

  const updated = await prisma.page.update({
    where: { id: params.id },
    data: { title, content, status },
  });

  return NextResponse.json({ ok: true, data: updated });
}
