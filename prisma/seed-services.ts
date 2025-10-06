// prisma/seed-services.ts (optionnel)
import { PrismaClient, PriceType, ServiceAudience } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // crée un media “générique” pour tester
  const img = await prisma.media.create({
    data: { url: "/images/services/individuel.jpg", alt: "Accompagnement individuel" },
  });

  await prisma.service.createMany({
    data: [
      {
        slug: "accompagnement-individuel",
        title: "Accompagnement individuel",
        shortDescription: "Soutien personnalisé: stress, conflits, transitions.",
        longDescription:
          "Séances individuelles centrées sur vos objectifs, avec des outils concrets pour avancer sereinement.",
        iconKey: "lucide:user",
        audience: ServiceAudience.INDIVIDUAL,
        priceType: PriceType.FIXED,
        priceAmount: "60",
        priceCurrency: "EUR",
        priceLabel: "60 € / 50 min",
        order: 1,
        visible: true,
        imageId: img.id,
      },
      {
        slug: "souffrance-au-travail",
        title: "Souffrance au travail",
        shortDescription: "Burn-out, harcèlement, isolement.",
        longDescription:
          "Un accompagnement spécifique pour repérer, comprendre et réduire les facteurs de souffrance.",
        iconKey: "lucide:heart-crack",
        audience: ServiceAudience.INDIVIDUAL,
        priceType: PriceType.FIXED,
        priceAmount: "60",
        priceCurrency: "EUR",
        priceLabel: "60 € / 50 min",
        order: 2,
        visible: true,
        imageId: img.id,
      },
      {
        slug: "diagnostic-rps",
        title: "Diagnostic RPS",
        shortDescription: "Analyse des risques psychosociaux.",
        longDescription:
          "Audit, recommandations et plan d’actions pour améliorer durablement la qualité de vie au travail.",
        iconKey: "lucide:clipboard-list",
        audience: ServiceAudience.COMPANY,
        priceType: PriceType.QUOTE,
        order: 1,
        visible: true,
        imageId: img.id,
      },
    ],
  });
}

main().finally(() => prisma.$disconnect());