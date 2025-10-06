import { PrismaClient, PageSlug, PageStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pages = [
    {
      slug: PageSlug.MENTIONS_LEGALES,
      title: "Mentions légales",
      content: "# Mentions légales\n\n*Contenu à compléter.*",
    },
    {
      slug: PageSlug.POLITIQUE_DE_CONFIDENTIALITE,
      title: "Politique de confidentialité",
      content: "# Politique de confidentialité\n\n*Contenu à compléter.*",
    },
  ];

  for (const p of pages) {
    const existing = await prisma.page.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.page.create({
        data: { ...p, status: PageStatus.DRAFT },
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
