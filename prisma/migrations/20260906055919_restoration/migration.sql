-- CreateEnum
CREATE TYPE "RestorationStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "restorations" (
    "id" TEXT NOT NULL,
    "outageId" TEXT NOT NULL,
    "technicianId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "status" "RestorationStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restorations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restorations_outageId_key" ON "restorations"("outageId");

-- CreateIndex
CREATE INDEX "restorations_technicianId_idx" ON "restorations"("technicianId");

-- CreateIndex
CREATE INDEX "restorations_status_idx" ON "restorations"("status");

-- AddForeignKey
ALTER TABLE "restorations" ADD CONSTRAINT "restorations_outageId_fkey" FOREIGN KEY ("outageId") REFERENCES "outages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restorations" ADD CONSTRAINT "restorations_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;
