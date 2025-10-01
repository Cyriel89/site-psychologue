import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSession } from "@/lib/session";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  if (path.startsWith("/admin")) {
    // on lit le cookie côté middleware via req.cookies
    const token = req.cookies.get("psysite_session")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    // Validation simple: on réutilise le parseur
    try {
      const [b64, sig] = token.split(".");
      // pas d’accès à SECRET ici; on fait une vérif “best effort” : si pas de 2 parties => redirect
      if (!b64 || !sig) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", path);
        return NextResponse.redirect(loginUrl);
      }
      // Option: si besoin, stocke role dans un header pour l'edge (overkill ici)
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // dans middleware.ts, avant le return NextResponse.next()
  if (path.startsWith("/admin")) {
    // empêche mise en cache navigateur des pages admin
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    return res;
}
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
