import { prisma } from "@/lib/prisma";
import EditorForm from "./EditorForm";

export default async function EditPage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return <div>Page introuvable.</div>;

  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: page.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return <EditorForm initialPage={page} revisions={revisions} />;
}
