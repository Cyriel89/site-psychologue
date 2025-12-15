import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import FaqClient from "./FaqClient";

export default async function AdminFaqPage() {
  await requireAdminOrSupport();

  const faqs = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Foire Aux Questions (FAQ)</h1>
        <p className="text-gray-500 mt-1">
          Gérez les questions fréquentes pour rassurer vos patients avant la prise de rendez-vous.
        </p>
      </div>

      <FaqClient initialFaqs={faqs} />
    </div>
  );
}