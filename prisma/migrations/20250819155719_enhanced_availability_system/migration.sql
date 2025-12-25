/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Availability` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'TENTATIVE', 'BOOKED', 'TRAVEL_TIME');

-- CreateEnum
CREATE TYPE "public"."RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ExceptionType" AS ENUM ('SKIP', 'MODIFY', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "public"."BlackoutType" AS ENUM ('PERSONAL', 'HOLIDAY', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ThaiHolidayType" AS ENUM ('NATIONAL', 'ROYAL', 'RELIGIOUS', 'CULTURAL', 'REGIONAL');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Artist" ADD COLUMN     "autoAcceptBookings" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "defaultBufferTime" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "holidayPricing" DECIMAL(3,2),
ADD COLUMN     "maxAdvanceBooking" INTEGER NOT NULL DEFAULT 365,
ADD COLUMN     "maxTravelDistance" INTEGER,
ADD COLUMN     "minAdvanceBooking" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "travelRate" DECIMAL(10,2),
ADD COLUMN     "travelTimeBuffer" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "weekendPricing" DECIMAL(3,2);

-- AlterTable
ALTER TABLE "public"."Availability" DROP COLUMN "isAvailable",
ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "bufferAfter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bufferBefore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minimumHours" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priceMultiplier" DECIMAL(3,2) DEFAULT 1.00,
ADD COLUMN     "recurringPatternId" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "status" "public"."AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok';

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "travelCost" DECIMAL(10,2),
ADD COLUMN     "travelDistance" INTEGER,
ADD COLUMN     "travelTime" INTEGER;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryStatus" "public"."DeliveryStatus" NOT NULL DEFAULT 'SENT',
ADD COLUMN     "messageType" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "parentMessageId" TEXT;

-- CreateTable
CREATE TABLE "public"."RecurringPattern" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frequency" "public"."RecurrenceFrequency" NOT NULL,
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "weekOfMonth" INTEGER,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok',
    "priceMultiplier" DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    "minimumHours" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatternException" (
    "id" TEXT NOT NULL,
    "recurringPatternId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "exceptionType" "public"."ExceptionType" NOT NULL,
    "newStatus" "public"."AvailabilityStatus",
    "newStartTime" TEXT,
    "newEndTime" TEXT,
    "newPriceMultiplier" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatternException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlackoutDate" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "blackoutType" "public"."BlackoutType" NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringRule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlackoutDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlotTemplate" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "bufferBefore" INTEGER NOT NULL DEFAULT 0,
    "bufferAfter" INTEGER NOT NULL DEFAULT 0,
    "priceMultiplier" DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    "minimumAdvanceHours" INTEGER NOT NULL DEFAULT 24,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlotTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ThaiHoliday" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "holidayType" "public"."ThaiHolidayType" NOT NULL,
    "buddhistYear" INTEGER,
    "buddhistMonth" INTEGER,
    "buddhistDay" INTEGER,
    "isNationalHoliday" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThaiHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "quotedPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "requiresDeposit" BOOLEAN NOT NULL DEFAULT false,
    "depositAmount" DECIMAL(10,2),
    "depositPercentage" INTEGER,
    "inclusions" TEXT[],
    "exclusions" TEXT[],
    "notes" TEXT,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "customerNotes" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "paymentType" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentProofUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "transactionRef" TEXT,
    "promptPayRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TypingIndicator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "isTyping" BOOLEAN NOT NULL DEFAULT false,
    "lastTypingAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecurringPattern_artistId_idx" ON "public"."RecurringPattern"("artistId");

-- CreateIndex
CREATE INDEX "RecurringPattern_frequency_idx" ON "public"."RecurringPattern"("frequency");

-- CreateIndex
CREATE INDEX "RecurringPattern_dayOfWeek_idx" ON "public"."RecurringPattern"("dayOfWeek");

-- CreateIndex
CREATE INDEX "PatternException_date_idx" ON "public"."PatternException"("date");

-- CreateIndex
CREATE UNIQUE INDEX "PatternException_recurringPatternId_date_key" ON "public"."PatternException"("recurringPatternId", "date");

-- CreateIndex
CREATE INDEX "BlackoutDate_artistId_idx" ON "public"."BlackoutDate"("artistId");

-- CreateIndex
CREATE INDEX "BlackoutDate_startDate_endDate_idx" ON "public"."BlackoutDate"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "BlackoutDate_blackoutType_idx" ON "public"."BlackoutDate"("blackoutType");

-- CreateIndex
CREATE INDEX "TimeSlotTemplate_artistId_idx" ON "public"."TimeSlotTemplate"("artistId");

-- CreateIndex
CREATE INDEX "TimeSlotTemplate_isDefault_idx" ON "public"."TimeSlotTemplate"("isDefault");

-- CreateIndex
CREATE INDEX "ThaiHoliday_holidayType_idx" ON "public"."ThaiHoliday"("holidayType");

-- CreateIndex
CREATE INDEX "ThaiHoliday_isNationalHoliday_idx" ON "public"."ThaiHoliday"("isNationalHoliday");

-- CreateIndex
CREATE UNIQUE INDEX "ThaiHoliday_date_key" ON "public"."ThaiHoliday"("date");

-- CreateIndex
CREATE INDEX "Quote_bookingId_idx" ON "public"."Quote"("bookingId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "public"."Quote"("status");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "public"."Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "public"."Payment"("createdAt");

-- CreateIndex
CREATE INDEX "TypingIndicator_bookingId_idx" ON "public"."TypingIndicator"("bookingId");

-- CreateIndex
CREATE INDEX "TypingIndicator_userId_idx" ON "public"."TypingIndicator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TypingIndicator_userId_bookingId_key" ON "public"."TypingIndicator"("userId", "bookingId");

-- CreateIndex
CREATE INDEX "Availability_status_idx" ON "public"."Availability"("status");

-- CreateIndex
CREATE INDEX "Availability_recurringPatternId_idx" ON "public"."Availability"("recurringPatternId");

-- CreateIndex
CREATE INDEX "Message_bookingId_createdAt_idx" ON "public"."Message"("bookingId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_deliveryStatus_idx" ON "public"."Message"("deliveryStatus");

-- CreateIndex
CREATE INDEX "Message_parentMessageId_idx" ON "public"."Message"("parentMessageId");

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_recurringPatternId_fkey" FOREIGN KEY ("recurringPatternId") REFERENCES "public"."RecurringPattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecurringPattern" ADD CONSTRAINT "RecurringPattern_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatternException" ADD CONSTRAINT "PatternException_recurringPatternId_fkey" FOREIGN KEY ("recurringPatternId") REFERENCES "public"."RecurringPattern"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlackoutDate" ADD CONSTRAINT "BlackoutDate_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlotTemplate" ADD CONSTRAINT "TimeSlotTemplate_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "public"."Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TypingIndicator" ADD CONSTRAINT "TypingIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TypingIndicator" ADD CONSTRAINT "TypingIndicator_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
