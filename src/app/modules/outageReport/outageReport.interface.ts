export interface ICreateOutageReportPayload {
    outageId?: string;
    areaId: string;
    description: string;
    latitude?: number;
    longitude?: number;
}

export interface IUpdateOutageReportPayload {
    outageId?: string | null;
    areaId?: string;
    description?: string;
    latitude?: number | null;
    longitude?: number | null;
}
