export interface ICreateZonePayload {
    name: string;
    code: string;
    description?: string;
    isActive?: boolean;
}

export interface IUpdateZonePayload {
    name?: string;
    code?: string;
    description?: string;
    isActive?: boolean;
}
