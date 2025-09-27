/*
  Warnings:

  - You are about to drop the column `aboutImageId` on the `Setting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Setting" DROP CONSTRAINT "Setting_aboutImageId_fkey";

-- AlterTable
ALTER TABLE "public"."Setting" DROP COLUMN "aboutImageId";
