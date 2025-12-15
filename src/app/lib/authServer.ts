import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

export async function requireAdminOrSupport() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await parseSessionFromToken(token);

  if (!session || !session.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { id: true, firstName: true, email: true, role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPPORT")) {
    redirect("/account");
  }

  return user;
}