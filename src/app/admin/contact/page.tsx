// src/app/admin/contact/page.tsx
import { prisma } from "@/lib/prisma";
import AdminContact from "./AdminContact";

function normalizeEditable(input: unknown) {
  const o = (typeof input === "object" && input) ? (input as Record<string, unknown>) : {};
  const s = (v: unknown, def = "") => (typeof v === "string" ? v : def);

  return {
    // 🚦Uniquement les champs éditables par la cliente :
    title:        s(o.title, "Contact"),
    intro:        s(o.intro, ""),
    email:        s(o.email, "contact@example.com"),
    phone:        s(o.phone, ""),
    address:      s(o.address, ""),
    openingHours: s(o.openingHours, ""),
    booking:      s(o.booking, "#booking"),
    // Les champs suivants existent en BDD mais NE SONT PAS exposés ici :
    // rgpdLabel / successMessage / errorMessage
  };
}

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const s = await prisma.setting.findUnique({ where: { id: "global" } });
  const initial = normalizeEditable(s?.contact);
  return <AdminContact initial={initial} />;
}