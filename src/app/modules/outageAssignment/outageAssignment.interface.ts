import {
    AssignmentStatus,
    OutageAssignment,
} from '../../../generated/prisma/client';

export type ICreateOutageAssignmentPayload = {
    outageId: string;
    technicianId: string;
};

export type IOutageAssignmentResponse = OutageAssignment;

export interface IOutageAssignmentQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IUpdateOutageAssignmentPayload {
    status?: AssignmentStatus;
    acceptedAt?: Date | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
}
