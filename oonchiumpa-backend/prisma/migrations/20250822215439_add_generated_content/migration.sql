-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('BLOG_POST', 'TEAM_PROFILE', 'HISTORICAL_PIECE', 'TRANSFORMATION_STORY', 'COMMUNITY_STORY', 'CULTURAL_INSIGHT', 'YOUTH_WORK');

-- CreateTable
CREATE TABLE "public"."generated_content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."ContentType" NOT NULL,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "metaData" JSONB,
    "seoData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "authorUserId" TEXT,

    CONSTRAINT "generated_content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."generated_content" ADD CONSTRAINT "generated_content_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
