-- CreateIndex
CREATE INDEX "HireRequest_user_id_idx" ON "HireRequest"("user_id");

-- CreateIndex
CREATE INDEX "HireRequest_user_id_createdAt_idx" ON "HireRequest"("user_id", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- CreateIndex
CREATE INDEX "Payment_user_id_createdAt_idx" ON "Payment"("user_id", "createdAt");
