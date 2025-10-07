// lib/authServer.ts
import { cookies } from "next/headers";
import { parseSessionFromToken, COOKIE_NAME } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireAdminOrSupport() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const session = parseSessionFromToken(token);

  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "unauthorized", hasToken: !!token, reason: "invalid_or_expired_token" },
        { status: 403 }
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, firstName: true, email: true, role: true },
  });

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "unauthorized", hasToken: !!token, reason: "user_not_found" },
        { status: 403 }
      ),
    };
  }

  if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, error: "forbidden", hasToken: !!token, reason: "insufficient_role", role: user.role },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const, user };
}
