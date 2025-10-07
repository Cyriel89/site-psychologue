import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session"; // ← ta fonction actuelle
// Rôles autorisés: 'admin' | 'support'

export async function assertAdminOrSupport(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await parseSessionFromToken(token);
  if (!session?.user || !["ADMIN", "SUPPORT"].includes(session.user.role)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  return null; // ok
}