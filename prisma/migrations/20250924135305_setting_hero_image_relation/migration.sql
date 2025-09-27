-- AlterTable
ALTER TABLE "public"."Setting" ADD COLUMN     "heroImageId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "Setting_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
