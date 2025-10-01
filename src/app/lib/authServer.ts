import { cookies } from "next/headers";
import { parseSessionFromToken, COOKIE_NAME } from "@/lib/session";

export async function requireAdminOrSupport() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId) return null;
  const role = session.role;
  if (role !== "ADMIN" && role !== "SUPPORT") return null;
  return { userId: session.userId, role };
}
