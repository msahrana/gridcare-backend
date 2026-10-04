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

export interface IOutageReportQuery {
    page?: string | number;
    limit?: string | number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
