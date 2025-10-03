import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminMedia from "./AdminMedia";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
    redirect("/admin/login");
  }

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminMedia
      initialMedia={media.map(m => ({
        id: m.id,
        url: m.url,
        alt: m.alt ?? "",
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}