import { prisma } from "@/lib/prisma";
import { requireAdminOrSupport } from "@/lib/authServer";
import LegalPageForm from "./LegalPageForm";
import { redirect } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminOrSupport();

  const { id } = await params;

  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) {
     redirect("/admin/legal-pages");
  }

  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: page.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, createdAt: true, status: true }
  });

  return (
     <div className="max-w-6xl mx-auto pb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-gray-400 font-normal">Édition /</span> 
            {page.title}
        </h1>
        
        <LegalPageForm 
            initialPage={page} 
            revisions={revisions.map(r => ({ ...r, status: r.status || "DRAFT" }))} 
        />
     </div>
  );
}