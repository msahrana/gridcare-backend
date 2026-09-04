import { z } from 'zod';

const createAuditLogValidationSchema = z.object({
    action: z
        .string({ message: 'Action is required' })
        .min(2, 'Action must be at least 2 characters')
        .max(100, 'Action cannot exceed 100 characters'),

    entity: z
        .string({ message: 'Entity is required' })
        .min(2, 'Entity must be at least 2 characters')
        .max(100, 'Entity cannot exceed 100 characters'),

    entityId: z
        .string({ message: 'Entity ID is required' })
        .uuid('Invalid Entity ID'),

    oldValue: z.unknown().optional(),

    newValue: z.unknown().optional(),

    ipAddress: z.string().max(100, 'IP address is invalid').optional(),
});

export const AuditLogValidation = {
    createAuditLogValidationSchema,
};
