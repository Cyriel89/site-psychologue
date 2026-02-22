/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    throw new Error("Invalid session token", { cause: error });
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) return null;

  try {
    // On réutilise ta fonction existante pour décoder le token
    const session = await parseSessionFromToken(token);
    return session;
  } catch (error) {
    // Si le token est expiré ou invalide, on retourne null au lieu de faire planter l'app
    return null; 
  }
}