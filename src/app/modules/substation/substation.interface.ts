export interface ICreateSubstationPayload {
    name: string;
    code: string;
    zoneId: string;
    capacity?: number;
    isActive?: boolean;
}

export interface IUpdateSubstationPayload {
    name?: string;
    code?: string;
    zoneId?: string;
    capacity?: number;
    isActive?: boolean;
}
