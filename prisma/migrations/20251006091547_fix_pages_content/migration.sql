/*
  Warnings:

  - You are about to drop the column `plublishedAt` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `updadeBy` on the `Page` table. All the data in the column will be lost.
  - The `status` column on the `Page` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `PageRevision` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "public"."Page" DROP COLUMN "plublishedAt",
DROP COLUMN "updadeBy",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "updateBy" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."PageStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."PageRevision" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PageStatus" NOT NULL;

-- DropEnum
DROP TYPE "public"."PageSatus";
