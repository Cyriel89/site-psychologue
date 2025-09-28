// scripts/restore-settings.ts
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

type Backup = {
  setting: {
    id: string;
    hero: unknown | null;
    about: unknown | null;
    heroImageId: string | null;
  };
  media: {
    heroImage: { id: string; url: string; alt: string | null } | null;
  };
};

async function ensureMedia(m: Backup["media"]["heroImage"]) {
  if (!m) return null;
  // On tente de retrouver un Media par URL (plus robuste que par id après reset)
  const existing = await prisma.media.findFirst({ where: { url: m.url } });
  if (existing) return existing.id;

  const created = await prisma.media.create({
    data: { url: m.url, alt: m.alt ?? undefined },
  });
  return created.id;
}

async function main() {
  const file = path.join(process.cwd(), "backup", "settings.json");
  if (!fs.existsSync(file)) throw new Error("backup/settings.json introuvable");

  const backup = JSON.parse(fs.readFileSync(file, "utf-8")) as Backup;

  // Recrée les médias si besoin (on relie par URL)
  const heroImageId = await ensureMedia(backup.media.heroImage);

  // Upsert du Setting.global
  await prisma.setting.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      hero: backup.setting.hero ?? {},
      about: backup.setting.about ?? {},
      heroImageId: heroImageId ?? undefined,
    },
    update: {
      hero: backup.setting.hero ?? {},
      about: backup.setting.about ?? {},
      heroImageId: heroImageId ?? undefined,
    },
  });

  console.log("✅ Setting.global restauré avec ses images liées.");
}

main().finally(() => prisma.$disconnect());
