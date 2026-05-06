-- CreateTable
CREATE TABLE "ChatQuery" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatQuery_createdAt_idx" ON "ChatQuery"("createdAt");

