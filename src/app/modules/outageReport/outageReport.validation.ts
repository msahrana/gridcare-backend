import { z } from 'zod';

const createOutageReportSchema = z.object({
    outageId: z.string().uuid('Invalid outage ID').optional(),

    areaId: z.string().uuid('Invalid area ID'),

    description: z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),

    latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional(),

    longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional(),
});

const updateOutageReportSchema = z.object({
    outageId: z.string().uuid('Invalid outage ID').nullable().optional(),

    areaId: z.string().uuid('Invalid area ID').optional(),

    description: z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),

    latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .nullable()
        .optional(),

    longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .nullable()
        .optional(),
});

export const OutageReportValidation = {
    createOutageReportSchema,
    updateOutageReportSchema,
};
