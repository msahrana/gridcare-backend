-- DropIndex
DROP INDEX "restorations_outageId_key";

-- CreateIndex
CREATE INDEX "restorations_outageId_idx" ON "restorations"("outageId");
