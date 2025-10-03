// src/app/admin/faq/page.tsx
import { prisma } from "@/lib/prisma";
import AdminFaq from "./AdminFaq";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return <AdminFaq initialFaqs={faqs} />;
}