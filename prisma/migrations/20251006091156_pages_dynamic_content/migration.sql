-- CreateEnum
CREATE TYPE "public"."PageSatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."PageSlug" AS ENUM ('MENTIONS_LEGALES', 'POLITIQUE_DE_CONFIDENTIALITE');

-- CreateTable
CREATE TABLE "public"."Page" (
    "id" TEXT NOT NULL,
    "slug" "public"."PageSlug" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."PageSatus" NOT NULL DEFAULT 'DRAFT',
    "plublishedAt" TIMESTAMP(3),
    "updadeBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PageRevision" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."PageSatus" NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "public"."Page"("slug");

-- CreateIndex
CREATE INDEX "PageRevision_pageId_createdAt_idx" ON "public"."PageRevision"("pageId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."PageRevision" ADD CONSTRAINT "PageRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
