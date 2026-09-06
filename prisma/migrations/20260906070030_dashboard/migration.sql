-- AlterTable
ALTER TABLE "outage_assignments" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED';

-- CreateIndex
CREATE INDEX "outage_assignments_status_idx" ON "outage_assignments"("status");
