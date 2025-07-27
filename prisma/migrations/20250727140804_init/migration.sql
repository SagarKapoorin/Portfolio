-- CreateTable
CREATE TABLE "DowntimeWindow" (
    "id" SERIAL NOT NULL,
    "gateway" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DowntimeWindow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DowntimeWindow_gateway_method_endTime_idx" ON "DowntimeWindow"("gateway", "method", "endTime");
