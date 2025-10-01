import { NextRequest, NextResponse } from "next/server";
import { parseSessionFromToken, COOKIE_NAME } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId) {
        return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: true, role: session.role }, { headers: { "Cache-Control": "no-store" } });
}
