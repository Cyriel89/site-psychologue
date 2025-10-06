import { prisma } from "@/lib/prisma";
import { PageSlug, PageStatus } from "@prisma/client";
import Markdown from "@/components/Markdown";

export default async function PrivacyPolicy() {
  const page = await prisma.page.findFirst({
    where: { slug: PageSlug.POLITIQUE_DE_CONFIDENTIALITE, status: PageStatus.PUBLISHED },
  });

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{ page?.title || "Politique de confidentialité" }</h1>
      {!page ? (
        <p>Cette page n’est pas encore disponible.</p>
      ) : (
        <Markdown source={page.content} />
      )}
    </main>
  );
}

export const revalidate = 0;
