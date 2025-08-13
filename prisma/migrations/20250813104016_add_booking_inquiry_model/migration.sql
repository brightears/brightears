-- CreateTable
CREATE TABLE "public"."BookingInquiry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "eventType" TEXT,
    "location" TEXT,
    "inquiryMethod" TEXT NOT NULL DEFAULT 'FORM',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingInquiry_artistId_idx" ON "public"."BookingInquiry"("artistId");

-- CreateIndex
CREATE INDEX "BookingInquiry_userId_idx" ON "public"."BookingInquiry"("userId");

-- CreateIndex
CREATE INDEX "BookingInquiry_createdAt_idx" ON "public"."BookingInquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."BookingInquiry" ADD CONSTRAINT "BookingInquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingInquiry" ADD CONSTRAINT "BookingInquiry_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
