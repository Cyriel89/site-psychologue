import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, role: session.role });
}
