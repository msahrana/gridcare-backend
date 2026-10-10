"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const zod_1 = require("zod");
const createNotificationValidationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid User ID'),
    title: zod_1.z
        .string({ message: 'Title is required' })
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters'),
    message: zod_1.z
        .string({ message: 'Message is required' })
        .min(3, 'Message must be at least 3 characters')
        .max(1000, 'Message cannot exceed 1000 characters'),
});
exports.NotificationValidation = {
    createNotificationValidationSchema,
};
