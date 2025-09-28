// scripts/backup-settings.ts
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const setting = await prisma.setting.findUnique({
    where: { id: "global" },
    include: { heroImage: true },
  });

  if (!setting) {
    throw new Error("Setting 'global' introuvable — rien à sauvegarder.");
  }

  const payload = {
    setting: {
      id: setting.id,
      hero: setting.hero ?? null,
      about: setting.about ?? null,
      heroImageId: setting.heroImageId ?? null,
    
    },
    media: {
      heroImage: setting.heroImage
        ? { id: setting.heroImage.id, url: setting.heroImage.url, alt: setting.heroImage.alt ?? null }
        : null
    },
  };

  const outDir = path.join(process.cwd(), "backup");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, "settings.json");
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  console.log(`✅ Backup écrit dans ${file}`);
}

main().finally(() => prisma.$disconnect());
