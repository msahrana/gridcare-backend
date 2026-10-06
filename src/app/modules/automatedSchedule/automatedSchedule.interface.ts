import { ScheduleStatus } from "../../../generated/prisma/enums";

export interface IGenerateSchedulePayload {
    areaIds: string[];
    date: string;
    startTime: string;
    endTime: string;
    title?: string;
    description?: string;
    createdById: string;
}

export interface IGeneratedSchedule {
    id: string;
    areaId: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    status: string;
    createdById: string;
}

export interface IAutomatedScheduleQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    areaId?: string;
    status?: ScheduleStatus;
    startDate?: string;
    endDate?: string;
}
