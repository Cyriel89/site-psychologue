// src/app/admin/partners/page.tsx
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminPartners from "./AdminPartners";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
    redirect("/admin/login");
  }

  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { logo: true },
  });

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <AdminPartners
      initialPartners={partners.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.url ?? "",
        description: p.description ?? "",
        logoId: p.logoId ?? "",
        logo: p.logo ? { id: p.logo.id, url: p.logo.url, alt: p.logo.alt ?? "" } : null,
        visible: p.visible,
        order: p.order,
      }))}
      media={media.map((m) => ({ id: m.id, url: m.url, alt: m.alt ?? "" }))}
    />
  );
}