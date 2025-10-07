/*
  Warnings:

  - You are about to drop the column `requestedBy` on the `cultural_consultations` table. All the data in the column will be lost.
  - The `status` column on the `cultural_consultations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `cultural_consultations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approvalStatus` column on the `cultural_consultations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `requestedById` to the `cultural_consultations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sharingPermissions` on the `dreaming_story_protocols` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ConsultationStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ConsultationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."SharingPermission" AS ENUM ('PUBLIC_UNRESTRICTED', 'PUBLIC_WITH_ATTRIBUTION', 'COMMUNITY_ONLY', 'RESTRICTED_ELDERS', 'SACRED_NO_SHARING');

-- DropForeignKey
ALTER TABLE "public"."cultural_consultations" DROP CONSTRAINT "cultural_consultations_requestedBy_fkey";

-- DropIndex
DROP INDEX "public"."cultural_consultations_contentType_contentId_idx";

-- DropIndex
DROP INDEX "public"."cultural_consultations_status_idx";

-- DropIndex
DROP INDEX "public"."dreaming_story_protocols_storyTitle_idx";

-- AlterTable
ALTER TABLE "public"."cultural_consultations" DROP COLUMN "requestedBy",
ADD COLUMN     "requestedById" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ConsultationStatus" NOT NULL DEFAULT 'REQUESTED',
DROP COLUMN "priority",
ADD COLUMN     "priority" "public"."ConsultationPriority" NOT NULL DEFAULT 'MEDIUM',
DROP COLUMN "approvalStatus",
ADD COLUMN     "approvalStatus" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."dreaming_story_protocols" DROP COLUMN "sharingPermissions",
ADD COLUMN     "sharingPermissions" "public"."SharingPermission" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."cultural_consultations" ADD CONSTRAINT "cultural_consultations_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
