// src/app/admin/about/page.tsx
import { prisma } from "@/lib/prisma";
import AdminAbout from "./AdminAbout";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = parseSessionFromToken(token);
  if (!session?.userId || !["ADMIN", "SUPPORT"].includes(session.role)) {
    redirect("/admin/login");
  }

  const setting = await prisma.setting.findUnique({
    where: { id: "global" },
  });

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Valeurs par défaut si vide
  const about = (setting?.about as any) ?? {
    title: "À propos",
    presentation: "",
    mission: "",
    goal: "",
  };

  return (
    <AdminAbout
      initialAbout={{
        title: about.title ?? "À propos",
        presentation: about.presentation ?? "",
        mission: about.mission ?? "",
        goal: about.goal ?? "",
      }}
    />
  );
}