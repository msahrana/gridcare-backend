import { z } from 'zod';

const createAreaSchema = z.object({
    name: z
        .string()
        .min(2, 'Area name must be at least 2 characters')
        .max(100, 'Area name cannot exceed 100 characters'),

    code: z
        .string()
        .min(2, 'Area code must be at least 2 characters')
        .max(50, 'Area code cannot exceed 50 characters')
        .regex(
            /^[A-Z0-9_-]+$/,
            'Area code can only contain uppercase letters, numbers, _ and -',
        ),

    zoneId: z.string().uuid('Invalid zone ID'),

    substationId: z
        .string()
        .uuid('Invalid substation ID')
        .optional()
        .nullable(),

    feederId: z.string().uuid('Invalid feeder ID').optional().nullable(),

    address: z
        .string()
        .max(255, 'Address cannot exceed 255 characters')
        .optional()
        .nullable(),

    latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional()
        .nullable(),

    longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional()
        .nullable(),

    isActive: z.boolean().optional(),
});

const updateAreaSchema = z.object({
    name: z.string().min(2).max(100).optional(),

    code: z
        .string()
        .min(2)
        .max(50)
        .regex(
            /^[A-Z0-9_-]+$/,
            'Area code can only contain uppercase letters, numbers, _ and -',
        )
        .optional(),

    zoneId: z.string().uuid('Invalid zone ID').optional(),

    substationId: z
        .string()
        .uuid('Invalid substation ID')
        .optional()
        .nullable(),

    feederId: z.string().uuid('Invalid feeder ID').optional().nullable(),

    address: z.string().max(255).optional().nullable(),

    latitude: z.number().min(-90).max(90).optional().nullable(),

    longitude: z.number().min(-180).max(180).optional().nullable(),

    isActive: z.boolean().optional(),
});

const areaQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),

    limit: z.coerce.number().int().min(1).max(100).optional(),

    search: z.string().optional(),

    zoneId: z.string().uuid().optional(),

    substationId: z.string().uuid().optional(),

    feederId: z.string().uuid().optional(),

    isActive: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});

export const AreaValidation = {
    createAreaSchema,
    updateAreaSchema,
    areaQuerySchema,
};
