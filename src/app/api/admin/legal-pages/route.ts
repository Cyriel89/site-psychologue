import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { assertAdminOrSupport } from "@/lib/admin-guard";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const guard = await assertAdminOrSupport(req);
  if (guard) return guard;

  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ ok: true, data: pages });
}
