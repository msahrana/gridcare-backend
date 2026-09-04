import { AuditLog } from '../../../generated/prisma/client';

export type ICreateAuditLogPayload = {
    action: string;
    entity: string;
    entityId: string;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string;
};

export type IUpdateAuditLogPayload = {
    action?: string;
    entity?: string;
    entityId?: string;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string;
};

export type IAuditLogResponse = AuditLog;
