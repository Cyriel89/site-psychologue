import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidateTag } from "next/cache";
import { PAGE_TAG } from "@/lib/cache-tags";
import { PageStatus, PageSlug } from "@prisma/client";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrSupport();
    if (!auth.ok) return auth.response;

  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { status: PageStatus.DRAFT },
  });

  if (page.slug === PageSlug.MENTIONS_LEGALES) revalidateTag(PAGE_TAG.MENTIONS);
  if (page.slug === PageSlug.POLITIQUE_DE_CONFIDENTIALITE) revalidateTag(PAGE_TAG.POLITIQUE);

  return NextResponse.json({ ok: true, data: updated });
}
