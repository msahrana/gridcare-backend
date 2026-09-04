import { z } from 'zod';

const createNotificationValidationSchema = z.object({
    userId: z.string().uuid('Invalid User ID'),

    title: z
        .string({ message: 'Title is required' })
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters'),

    message: z
        .string({ message: 'Message is required' })
        .min(3, 'Message must be at least 3 characters')
        .max(1000, 'Message cannot exceed 1000 characters'),
});

export const NotificationValidation = {
    createNotificationValidationSchema,
};
