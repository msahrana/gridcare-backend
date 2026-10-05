import { RestorationStatus } from '../../../generated/prisma/enums';

export interface ICreateRestorationPayload {
    outageId: string;
    technicianId?: string;
    remarks?: string;
}

export interface IUpdateRestorationPayload {
    remarks?: string;
}

export interface IRestorationQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: RestorationStatus;
    technicianId?: string;
    outageId?: string;
}
