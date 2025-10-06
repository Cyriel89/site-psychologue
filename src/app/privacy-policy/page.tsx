import { prisma } from "@/lib/prisma";
import { PageSlug, PageStatus } from "@prisma/client";
import Markdown from "@/components/Markdown";

export default async function PolitiqueConfidentialitePage() {
  const page = await prisma.page.findFirst({
    where: { slug: PageSlug.POLITIQUE_DE_CONFIDENTIALITE, status: PageStatus.PUBLISHED },
  });

  return (
    <main className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold mb-6">{ page?.title || "Politique de confidentialité" }</h1>
      {!page ? (
        <p>Cette page n’est pas encore disponible.</p>
      ) : (
        <Markdown source={page.content} />
      )}
    </main>
  );
}

export const revalidate = 0;
