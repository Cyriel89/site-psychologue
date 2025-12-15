import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "psysite_session";
const SECRET_KEY = process.env.SESSION_SECRET || "dev-secret-change-me";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function createSession(payload: any) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8h

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(encodedKey);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function parseSessionFromToken(token: string | undefined = "") {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string; role: string; [key: string]: any };
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}