import {
    LoadSheddingSchedule,
    ScheduleStatus,
} from '../../../generated/prisma/client';

export type ICreateLoadSheddingSchedulePayload = {
    areaId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    scheduleFee?: number;
};

export type IUpdateLoadSheddingSchedulePayload = {
    areaId?: string;
    title?: string;
    description?: string | null;
    startTime?: Date;
    endTime?: Date;
    
};

export type ILoadSheddingScheduleResponse = LoadSheddingSchedule;

export interface ILoadSheddingScheduleQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;
    areaId?: string;
    status?: ScheduleStatus;
}
