import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import AboutForm from "./AboutForm";

export default async function AdminAboutPage() {
  await requireAdminOrSupport();

  const setting = await prisma.setting.findUnique({ where: { id: "global" } });
  
  // Casting sécurisé du JSON
  const aboutJson = (setting?.about as any) ?? {};

  const initialData = {
    title: aboutJson.title ?? "",
    presentation: aboutJson.description.presentation ?? "",
    mission: aboutJson.description.mission ?? "",
    goal: aboutJson.description.goal ?? "",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">À Propos</h1>
        <p className="text-gray-500 mt-1">
          Gérez votre présentation et votre biographie.
        </p>
      </div>

      <AboutForm initial={initialData} />
    </div>
  );
}