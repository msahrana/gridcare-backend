import { Prisma } from '../../../generated/prisma/client';

export interface IUpdateAreaPayload {
    name?: string;
    code?: string;
    zoneId?: string;
    substationId?: string | null;
    feederId?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isActive?: boolean;
}

export interface ICreateAreaPayload {
    name: string;
    code: string;
    zoneId: string;
    substationId?: string | null;
    feederId?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isActive?: boolean;
}

export interface IAreaQuery {
    page?: number;
    limit?: number;
    search?: string;
    zoneId?: string;
    substationId?: string;
    feederId?: string;
    isActive?: boolean;
}

export interface IAreaParams {
    id: string;
}
