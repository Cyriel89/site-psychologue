import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

export function middleware(req: NextRequest) {

  // Pas de cookie => on renvoie à l'accueil (ne révèle pas l’existence de /admin)
  const hasCookie = req.cookies.has(COOKIE_NAME);
  if (!hasCookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
