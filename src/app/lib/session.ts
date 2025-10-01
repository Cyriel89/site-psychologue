import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "psysite_session";
const SESSION_TTL = 60 * 60 * 8; // 8h
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export async function createSessionCookie(value: object) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_TTL;
  const body = { ...value, iat: now, exp };
  const json = JSON.stringify(body);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = sign(b64);
  const token = `${b64}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function readSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  if (sign(b64) !== sig) return null;
  const json = Buffer.from(b64, "base64url").toString("utf8");
  const data = JSON.parse(json) as { exp: number; [k: string]: any };
  if (data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
