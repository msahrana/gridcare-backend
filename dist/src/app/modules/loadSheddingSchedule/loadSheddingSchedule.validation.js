"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadSheddingScheduleValidation = void 0;
const zod_1 = require("zod");
const createLoadSheddingScheduleValidationSchema = zod_1.z
    .object({
    areaId: zod_1.z
        .string({ message: 'Area ID is required' })
        .uuid('Invalid Area ID'),
    title: zod_1.z
        .string({ message: 'Title is required' })
        .min(3, 'Title must be at least 3 characters'),
    description: zod_1.z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),
    startTime: zod_1.z
        .string({ message: 'Start time is required' })
        .datetime('Invalid start time'),
    endTime: zod_1.z
        .string({ message: 'End time is required' })
        .datetime('Invalid end time'),
    scheduleFee: zod_1.z
        .number()
        .nonnegative('Schedule fee cannot be negative')
        .optional(),
})
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
});
const updateLoadSheddingScheduleValidationSchema = zod_1.z
    .object({
    areaId: zod_1.z.string().uuid('Invalid Area ID').optional(),
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .nullable()
        .optional(),
    startTime: zod_1.z.string().datetime('Invalid start time').optional(),
    endTime: zod_1.z.string().datetime('Invalid end time').optional(),
    scheduleFee: zod_1.z
        .number()
        .nonnegative('Schedule fee cannot be negative')
        .nullable()
        .optional(),
})
    .refine((data) => {
    if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
    }
    return true;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});
exports.LoadSheddingScheduleValidation = {
    createLoadSheddingScheduleValidationSchema,
    updateLoadSheddingScheduleValidationSchema,
};
