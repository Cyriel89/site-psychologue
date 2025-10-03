/*
  Warnings:

  - A unique constraint covering the columns `[order,audience]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_order_audience_key" ON "public"."Service"("order", "audience");
