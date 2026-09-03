import { OutageAssignment } from '../../../generated/prisma/client';

export type ICreateOutageAssignmentPayload = {
    outageId: string;
    technicianId: string;
};

export type IUpdateOutageAssignmentPayload = {
    completedAt?: Date | null;
};

export type IOutageAssignmentResponse = OutageAssignment;
