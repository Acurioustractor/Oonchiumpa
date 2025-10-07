-- Add cultural advisory board system
CREATE TABLE "cultural_advisors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "community" TEXT,
    "specialties" TEXT[],
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultural_advisors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cultural_consultations" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "requestedBy" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "recommendations" TEXT,
    "culturalSensitivityRating" INTEGER,
    "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultural_consultations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dreaming_story_protocols" (
    "id" TEXT NOT NULL,
    "storyTitle" TEXT NOT NULL,
    "storyType" TEXT NOT NULL,
    "traditionalOwners" TEXT[],
    "geographicOrigin" TEXT,
    "seasonalRestrictions" TEXT[],
    "genderRestrictions" TEXT,
    "ageRestrictions" TEXT,
    "ceremonialContext" TEXT,
    "sharingPermissions" TEXT NOT NULL,
    "consultationRequired" BOOLEAN NOT NULL DEFAULT true,
    "advisorId" TEXT NOT NULL,
    "validatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dreaming_story_protocols_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "cultural_consultations" ADD CONSTRAINT "cultural_consultations_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cultural_consultations" ADD CONSTRAINT "cultural_consultations_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "cultural_advisors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dreaming_story_protocols" ADD CONSTRAINT "dreaming_story_protocols_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "cultural_advisors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add indexes for performance
CREATE INDEX "cultural_consultations_status_idx" ON "cultural_consultations"("status");
CREATE INDEX "cultural_consultations_contentType_contentId_idx" ON "cultural_consultations"("contentType", "contentId");
CREATE INDEX "dreaming_story_protocols_storyTitle_idx" ON "dreaming_story_protocols"("storyTitle");