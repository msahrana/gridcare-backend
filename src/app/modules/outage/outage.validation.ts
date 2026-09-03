import { z } from 'zod';

const createOutageSchema = z.object({
    areaId: z.string().uuid('Invalid area ID'),

    title: z.string().min(3, 'Title must be at least 3 characters').max(200),

    description: z.string().max(1000).optional(),

    type: z.enum(['PLANNED', 'UNEXPECTED']),

    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),

    status: z
        .enum([
            'REPORTED',
            'VERIFIED',
            'ASSIGNED',
            'IN_PROGRESS',
            'RESTORED',
            'CLOSED',
            'CANCELLED',
        ])
        .optional(),

    startedAt: z.coerce.date().optional(),

    restoredAt: z.coerce.date().optional(),
});

const updateOutageSchema = z.object({
    areaId: z.string().uuid('Invalid area ID').optional(),

    title: z.string().min(3).max(200).optional(),

    description: z.string().max(1000).nullable().optional(),

    type: z.enum(['PLANNED', 'UNEXPECTED']).optional(),

    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),

    status: z
        .enum([
            'REPORTED',
            'VERIFIED',
            'ASSIGNED',
            'IN_PROGRESS',
            'RESTORED',
            'CLOSED',
            'CANCELLED',
        ])
        .optional(),

    startedAt: z.coerce.date().nullable().optional(),

    restoredAt: z.coerce.date().nullable().optional(),
});

export const OutageValidation = {
    createOutageSchema,
    updateOutageSchema,
};
