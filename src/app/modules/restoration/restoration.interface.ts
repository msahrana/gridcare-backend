export interface ICreateRestorationPayload {
    outageId: string;
    technicianId?: string;
    remarks?: string;
}

export interface IUpdateRestorationPayload {
    remarks?: string;
}
