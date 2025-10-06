import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { assertAdminOrSupport } from "@/lib/admin-guard";
import { revalidateTag } from "next/cache";
import { PAGE_TAG } from "@/lib/cache-tags";
import { PageStatus, PageSlug } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await assertAdminOrSupport(req);
  if (guard) return guard;

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
