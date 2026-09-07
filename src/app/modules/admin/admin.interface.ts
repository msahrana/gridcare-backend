export interface IAdminUserQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: string;
    status?: string;
}

export interface IUpdateUserRolePayload {
    role: string;
}

export interface IAuditLogQuery {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
    entityId?: string;
    actorId?: string;
    startDate?: string;
    endDate?: string;
}
