import { LoadSheddingSchedule } from '../../../generated/prisma/client';

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
    scheduleFee?: number | null;
};

export type ILoadSheddingScheduleResponse = LoadSheddingSchedule;
