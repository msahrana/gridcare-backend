import {
    OutageStatus,
    OutageType,
    Priority,
} from '../../../generated/prisma/enums';

export interface ICreateOutagePayload {
    areaId: string;
    title: string;
    description?: string;
    type: OutageType;
    priority?: Priority;
    status?: OutageStatus;
    startedAt?: Date;
    restoredAt?: Date;
}

export interface IUpdateOutagePayload {
    areaId?: string;
    title?: string;
    description?: string | null;
    type?: OutageType;
    priority?: Priority;
    status?: OutageStatus;
    startedAt?: Date | null;
    restoredAt?: Date | null;
}
