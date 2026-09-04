import { z } from 'zod';

const createLoadSheddingScheduleValidationSchema = z
    .object({
        areaId: z
            .string({ message: 'Area ID is required' })
            .uuid('Invalid Area ID'),

        title: z
            .string({ message: 'Title is required' })
            .min(3, 'Title must be at least 3 characters'),

        description: z
            .string()
            .max(1000, 'Description cannot exceed 1000 characters')
            .optional(),

        startTime: z
            .string({ message: 'Start time is required' })
            .datetime('Invalid start time'),

        endTime: z
            .string({ message: 'End time is required' })
            .datetime('Invalid end time'),

        scheduleFee: z
            .number()
            .nonnegative('Schedule fee cannot be negative')
            .optional(),
    })
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
        message: 'End time must be after start time',
        path: ['endTime'],
    });

const updateLoadSheddingScheduleValidationSchema = z
    .object({
        areaId: z.string().uuid('Invalid Area ID').optional(),

        title: z
            .string()
            .min(3, 'Title must be at least 3 characters')
            .optional(),

        description: z
            .string()
            .max(1000, 'Description cannot exceed 1000 characters')
            .nullable()
            .optional(),

        startTime: z.string().datetime('Invalid start time').optional(),

        endTime: z.string().datetime('Invalid end time').optional(),

        scheduleFee: z
            .number()
            .nonnegative('Schedule fee cannot be negative')
            .nullable()
            .optional(),
    })
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                return new Date(data.endTime) > new Date(data.startTime);
            }

            return true;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime'],
        },
    );

export const LoadSheddingScheduleValidation = {
    createLoadSheddingScheduleValidationSchema,
    updateLoadSheddingScheduleValidationSchema,
};
