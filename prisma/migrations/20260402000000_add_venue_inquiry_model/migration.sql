-- CreateTable
CREATE TABLE "VenueInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "venueName" TEXT NOT NULL,
    "venueType" TEXT NOT NULL,
    "entertainmentType" TEXT NOT NULL,
    "musicStyles" TEXT[],
    "nightsPerWeek" INTEGER,
    "eventDate" TIMESTAMP(3),
    "message" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueInquiry_email_idx" ON "VenueInquiry"("email");

-- CreateIndex
CREATE INDEX "VenueInquiry_status_idx" ON "VenueInquiry"("status");

-- CreateIndex
CREATE INDEX "VenueInquiry_createdAt_idx" ON "VenueInquiry"("createdAt");
