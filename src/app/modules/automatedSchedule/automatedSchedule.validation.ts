import { z } from 'zod';

export const generateScheduleValidationSchema = z.object({
    areaIds: z
        .array(z.string().uuid('Invalid area ID'))
        .min(1, 'At least one area is required'),

    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

    startTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'Start time must be in HH:mm format',
        ),

    endTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'End time must be in HH:mm format',
        ),

    title: z.string().max(200, 'Title cannot exceed 200 characters').optional(),

    description: z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),

    createdById: z.string().uuid('Invalid creator ID'),
});
