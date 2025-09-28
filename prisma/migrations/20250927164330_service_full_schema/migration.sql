/*
  Warnings:

  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `longDescription` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceType` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PriceType" AS ENUM ('FIXED', 'QUOTE');

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "description",
DROP COLUMN "details",
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "priceAmount" TEXT,
ADD COLUMN     "priceCurrency" TEXT DEFAULT 'EUR',
ADD COLUMN     "priceLabel" TEXT,
ADD COLUMN     "priceType" "public"."PriceType" NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "public"."Service"("slug");
