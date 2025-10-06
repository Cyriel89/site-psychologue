import { prisma } from "@/lib/prisma";
import { PageSlug, PageStatus } from "@prisma/client";
import { PAGE_TAG } from "@/lib/cache-tags";
import Markdown from "@/components/Markdown";

export default async function LegalNotice() {
  const page = await prisma.page.findFirst({
    where: { slug: PageSlug.MENTIONS_LEGALES, status: PageStatus.PUBLISHED },
  });

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{ page?.title || "Mentions légales" }</h1>
      {!page ? (
        <p>Cette page n’est pas encore disponible.</p>
      ) : (
        <Markdown source={page.content} />
      )}
    </main>
  );
}

// Revalidation côté data (si tu préfères via fetch RSC)
// Alternative: si tu lisais via fetch API, ajoute { next: { tags: [PAGE_TAG.MENTIONS] } }
export const revalidate = 0; // on tirera parti de revalidateTag via API publish/unpublish
