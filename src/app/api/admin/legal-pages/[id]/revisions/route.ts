import { prisma }from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrSupport } from "@/lib/authServer";
import { revalidateTag } from "next/cache";
import { PAGE_TAG } from "@/lib/cache-tags";
import { PageSlug } from "@prisma/client";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrSupport();
  if (!auth.ok) return auth.response;
  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: params.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ ok: true, data: revisions });
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrSupport();
  if (!auth.ok) return auth.response;

  const { revisionId } = await _.json().catch(() => ({} as any));
  if (!revisionId) return NextResponse.json({ ok: false, error: "revisionId required" }, { status: 400 });

  const rev = await prisma.pageRevision.findUnique({ where: { id: revisionId } });
  if (!rev || rev.pageId !== params.id) return NextResponse.json({ ok: false, error: "Revision not found" }, { status: 404 });

  const page = await prisma.page.update({
    where: { id: params.id },
    data: {
      title: rev.title,
      content: rev.content,
      status: rev.status,
    },
  });

  // On crée une nouvelle révision "restore"
  await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title: page.title,
      content: page.content,
      status: page.status,
    },
  });

  // Invalidation cache selon slug
  if (page.slug === PageSlug.MENTIONS_LEGALES) revalidateTag(PAGE_TAG.MENTIONS);
  if (page.slug === PageSlug.POLITIQUE_DE_CONFIDENTIALITE) revalidateTag(PAGE_TAG.POLITIQUE);

  return NextResponse.json({ ok: true, data: page });
}
