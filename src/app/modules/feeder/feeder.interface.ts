export interface ICreateFeederPayload {
    name: string;
    code: string;
    substationId: string;
    status?: string;
}

export interface IUpdateFeederPayload {
    name?: string;
    code?: string;
    substationId?: string;
    status?: string;
}
