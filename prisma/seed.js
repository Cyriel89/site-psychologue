// prisma/seed-minimal.js
const { PrismaClient, ServiceAudience } = require("@prisma/client"); // enums accessibles ici
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seed minimal : démarrage…");

  // --- SETTINGS (facultatif mais pratique) ---
  await prisma.setting.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      theme: { primary: "#2563eb", secondary: "#f1f5f9", text: "#1f2937" },
      hero: {
        name: "Pauline Diné",
        title: "Psychologue du travail",
        subtitle: "Retrouvez équilibre et sérénité au travail",
        cta: { label: "Prendre rendez-vous", href: "#contact" },
      },
      about: {
        title: "À propos",
        description: {
            presentation: "Je suis Pauline Diné, psychologue du travail basée à Nantes. Mon approche est centrée sur l'écoute, la bienveillance et l’accompagnement au rythme de chacun.",
            mission: "J'accompagne les adultes en questionnement personnel ou professionnel, en souffrance au travail ou en quête d’un mieux-être. Mon travail s'appuie sur une approche intégrative, mêlant rigueur scientifique et sensibilité humaine.",
            goal: "Mon objectif : vous offrir un espace sécurisé pour comprendre, exprimer, évoluer."
        }
      },
    },
  });

  // --- MEDIA ---
  // ⚠️ Adapte les chemins si tu n'as pas encore ces fichiers dans /public/images/...
  const mPortrait = await prisma.media.create({
    data: { url: "/images/hero.jpg", alt: "Pauline Diné - Psychologue du travail" },
  });
  const mAbout = await prisma.media.create({
    data: {
      url: "/images/about.jpg",
      alt: "Portrait de la psychologue",
    },
  });
  const mAccompagnement = await prisma.media.create({
    data: {
      url: "/images/services/accompagnement.jpg",
      alt: "Accompagnement individuel",
    },
  });

  const mSouffrance = await prisma.media.create({
    data: {
      url: "/images/services/souffrance-travail.jpg",
      alt: "Souffrance au travail",
    },
  });

  const mSGenerale = await prisma.media.create({
    data: {
      url: "/images/partners/societe-generale.png",
      alt: "Logo Société Générale",
    },
  });

  // --- SERVICES (avec imageId) ---
  const s1 = await prisma.service.create({
    data: {
      title: "Accompagnement individuel",
      description:
        "Soutien personnalisé pour mieux gérer le stress, les conflits, ou les périodes de transition professionnelle.",
      details: "L’accompagnement individuel vise à offrir un espace confidentiel pour exprimer vos difficultés et trouver des solutions adaptées. Chaque séance est personnalisée selon votre parcours professionnel et votre état émotionnel.",      iconKey: "User",
      audience: ServiceAudience.INDIVIDUAL,
      order: 1,
      visible: true,
      imageId: mAccompagnement.id,
    },
  });

  const s2 = await prisma.service.create({
    data: {
      title: "Souffrance au travail",
      description:
        "Aide face au burn-out, harcèlement moral, ou sentiment d’isolement au sein de l’environnement professionnel.",
      details:
        "Évaluation de la situation, stratégies d’adaptation, accompagnement vers des solutions concrètes.",
      iconKey: "HeartCrack",
      audience: ServiceAudience.EMPLOYEE,
      order: 2,
      visible: true,
      imageId: mSouffrance.id,
    },
  });

  // --- FAQ ---
  await prisma.faq.createMany({
    data: [
      {
        question: "Comment se déroule une première consultation ?",
        answer:
          "Première séance d’échange pour comprendre vos attentes et poser les bases de l’accompagnement.",
        order: 1,
        visible: true,
      },
      {
        question: "Les consultations sont-elles confidentielles ?",
        answer:
          "Oui, le secret professionnel s’applique strictement conformément au code de déontologie.",
        order: 2,
        visible: true,
      },
    ],
    skipDuplicates: true,
  });

  // --- (Optionnel) PARTNER & PRICES si tes models existent ---
  try {
    // Partner (si tu as ajouté le model Partner)
    await prisma.partner.create({
      data: {
        name: "Société Générale",
        url: "https://www.societegenerale.com",
        order: 1,
        visible: true,
        logo: { connect: { id: mSGenerale.id } }, // remplace par un vrai logo si tu veux
        description: "Accompagnement des équipes sur la gestion du stress et le bien-être au travail."
    },
    });
  } catch {
    // pas de model Partner : on ignore
  }

  try {
    // Prices (si tu as gardé le model Price)
    await prisma.price.createMany({
      data: [
        {
          title: "Séance individuelle",
          price: "60€",
          description: "50 minutes",
          order: 1,
          visible: true,
        },
        {
          title: "Bilan de compétences",
          price: "500€",
          description: "Accompagnement complet sur 5 séances",
          order: 2,
          visible: true,
        },
      ],
      skipDuplicates: true,
    });
  } catch {
    // pas de model Price : on ignore
  }

  console.log("✅ Seed minimal terminé.");
  console.log("ℹ️ Services créés :", s1.title, "et", s2.title);
}

main()
  .catch((e) => {
    console.error("❌ Seed minimal échec :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
