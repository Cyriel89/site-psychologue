import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Pas de cookie => on renvoie à l'accueil (ne révèle pas l’existence de /admin)
  const hasCookie = req.cookies.has(COOKIE_NAME);
  if (!hasCookie) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
