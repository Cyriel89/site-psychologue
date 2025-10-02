import { cookies } from "next/headers";
import { parseSessionFromToken, COOKIE_NAME } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function requireAdminOrSupport() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, firstName: true, email: true, role: true },
  });

  if (!user) return null;
  if (user.role !== "ADMIN" && user.role !== "SUPPORT") return null;

  return user; // retourne les infos utilisateur
}