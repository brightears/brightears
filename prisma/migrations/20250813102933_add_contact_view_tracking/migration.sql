-- CreateTable
CREATE TABLE "public"."ContactView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "ContactView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactView_artistId_idx" ON "public"."ContactView"("artistId");

-- CreateIndex
CREATE INDEX "ContactView_userId_idx" ON "public"."ContactView"("userId");

-- CreateIndex
CREATE INDEX "ContactView_viewedAt_idx" ON "public"."ContactView"("viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContactView_userId_artistId_key" ON "public"."ContactView"("userId", "artistId");

-- AddForeignKey
ALTER TABLE "public"."ContactView" ADD CONSTRAINT "ContactView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContactView" ADD CONSTRAINT "ContactView_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
