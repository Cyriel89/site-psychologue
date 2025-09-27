-- AlterTable
ALTER TABLE "public"."Setting" ADD COLUMN     "aboutImageId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "Setting_aboutImageId_fkey" FOREIGN KEY ("aboutImageId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
