/*
  Warnings:

  - A unique constraint covering the columns `[outageId,technicianId]` on the table `outage_assignments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `technicians` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `technicians` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technicians" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "outage_assignments_assignedById_idx" ON "outage_assignments"("assignedById");

-- CreateIndex
CREATE UNIQUE INDEX "outage_assignments_outageId_technicianId_key" ON "outage_assignments"("outageId", "technicianId");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_userId_key" ON "technicians"("userId");

-- AddForeignKey
ALTER TABLE "outage_reports" ADD CONSTRAINT "outage_reports_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
