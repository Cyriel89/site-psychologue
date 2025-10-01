import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST(req: NextRequest) {
    clearSession();
    const url = new URL("/", req.url)
    const res = NextResponse.redirect(url);
    res.headers.set("cache-control", "no-store");
    return res;
}