import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminOrSupport } from "@/lib/authServer";
import { NextRequest } from "next/server";

export async function GET(_: Request) {
  const auth = await requireAdminOrSupport();
  if (!auth.ok) return auth.response;
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ ok: true, data: pages });
}
