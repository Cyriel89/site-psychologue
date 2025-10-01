import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

export async function POST(req: NextRequest) {
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  // on écrase le cookie avec Max-Age=0
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}