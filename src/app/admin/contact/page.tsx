import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import ContactForm from "./ContactForm";
import { ContactFormData } from "./actions";

function normalizeData(input: unknown): ContactFormData {
  const o = (typeof input === "object" && input) ? (input as Record<string, unknown>) : {};
  const s = (v: unknown, def = "") => (typeof v === "string" ? v : def);

  return {
    title:        s(o.title, "Me contacter"),
    intro:        s(o.intro, ""),
    email:        s(o.email, ""),
    phone:        s(o.phone, ""),
    address:      s(o.address, ""),
    openingHours: s(o.openingHours, ""),
    booking:      s(o.booking, "#rdv"),
  };
}

export default async function AdminContactPage() {
  await requireAdminOrSupport();

  const setting = await prisma.setting.findUnique({ where: { id: "global" } });
  const initial = normalizeData(setting?.contact);

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Page Contact</h1>
        <p className="text-gray-500 mt-1">
          Personnalisez les textes et les coordonnées spécifiques de votre page de contact.
        </p>
      </div>

      <ContactForm initial={initial} />
    </div>
  );
}