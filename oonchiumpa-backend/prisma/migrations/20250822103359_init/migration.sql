-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'ELDER', 'COMMUNITY_COORDINATOR', 'COMMUNITY_MEMBER');

-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."SensitivityLevel" AS ENUM ('PUBLIC', 'COMMUNITY', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('PDF', 'DOCX', 'TXT');

-- CreateEnum
CREATE TYPE "public"."ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "public"."WidgetType" AS ENUM ('STORIES_FEED', 'OUTCOMES_SHOWCASE', 'MEDIA_GALLERY', 'VIDEO_SHOWCASE', 'IMPACT_METRICS');

-- CreateEnum
CREATE TYPE "public"."UpdateFrequency" AS ENUM ('REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'COMMUNITY_MEMBER',
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "category" TEXT NOT NULL,
    "culturalSignificance" TEXT,
    "tags" TEXT[],
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sensitivityLevel" "public"."SensitivityLevel" NOT NULL DEFAULT 'COMMUNITY',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorUserId" TEXT,
    "extractionSourceId" TEXT,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."outcomes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "beneficiaries" INTEGER,
    "date" TIMESTAMP(3),
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sensitivityLevel" "public"."SensitivityLevel" NOT NULL DEFAULT 'COMMUNITY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorUserId" TEXT,
    "extractionSourceId" TEXT,

    CONSTRAINT "outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."outcome_metrics" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "outcome_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_items" (
    "id" TEXT NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "cdnUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "altText" TEXT,
    "tags" TEXT[],
    "processingStatus" "public"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "sensitivityLevel" "public"."SensitivityLevel" NOT NULL DEFAULT 'COMMUNITY',
    "aiDescription" TEXT,
    "aiTags" TEXT[],
    "culturalContext" TEXT,
    "filename" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedById" TEXT,
    "extractionSourceId" TEXT,

    CONSTRAINT "media_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "extractionStatus" "public"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "extractedData" JSONB,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "uploadedById" TEXT,

    CONSTRAINT "report_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_approvals" (
    "id" TEXT NOT NULL,
    "status" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approverId" TEXT NOT NULL,
    "storyId" TEXT,
    "outcomeId" TEXT,

    CONSTRAINT "content_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_widgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."WidgetType" NOT NULL,
    "configuration" JSONB NOT NULL,
    "filters" JSONB NOT NULL,
    "displayOptions" JSONB NOT NULL,
    "updateFrequency" "public"."UpdateFrequency" NOT NULL DEFAULT 'DAILY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MediaItemToStory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaItemToStory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MediaItemToOutcome" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaItemToOutcome_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "_MediaItemToStory_B_index" ON "public"."_MediaItemToStory"("B");

-- CreateIndex
CREATE INDEX "_MediaItemToOutcome_B_index" ON "public"."_MediaItemToOutcome"("B");

-- AddForeignKey
ALTER TABLE "public"."stories" ADD CONSTRAINT "stories_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stories" ADD CONSTRAINT "stories_extractionSourceId_fkey" FOREIGN KEY ("extractionSourceId") REFERENCES "public"."report_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."outcomes" ADD CONSTRAINT "outcomes_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."outcomes" ADD CONSTRAINT "outcomes_extractionSourceId_fkey" FOREIGN KEY ("extractionSourceId") REFERENCES "public"."report_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."outcome_metrics" ADD CONSTRAINT "outcome_metrics_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "public"."outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_items" ADD CONSTRAINT "media_items_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_items" ADD CONSTRAINT "media_items_extractionSourceId_fkey" FOREIGN KEY ("extractionSourceId") REFERENCES "public"."report_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_documents" ADD CONSTRAINT "report_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_approvals" ADD CONSTRAINT "content_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_approvals" ADD CONSTRAINT "content_approvals_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "public"."stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_approvals" ADD CONSTRAINT "content_approvals_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "public"."outcomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaItemToStory" ADD CONSTRAINT "_MediaItemToStory_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."media_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaItemToStory" ADD CONSTRAINT "_MediaItemToStory_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaItemToOutcome" ADD CONSTRAINT "_MediaItemToOutcome_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."media_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaItemToOutcome" ADD CONSTRAINT "_MediaItemToOutcome_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
