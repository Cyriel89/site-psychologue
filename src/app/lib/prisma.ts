// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Trick pour éviter de recréer des instances de PrismaClient en dev (HMR)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // tu peux enlever "query" si trop verbeux
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
