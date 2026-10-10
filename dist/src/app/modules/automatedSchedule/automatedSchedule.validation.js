"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScheduleValidationSchema = void 0;
const zod_1 = require("zod");
exports.generateScheduleValidationSchema = zod_1.z.object({
    areaIds: zod_1.z
        .array(zod_1.z.string().uuid('Invalid area ID'))
        .min(1, 'At least one area is required'),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm format'),
    endTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format'),
    title: zod_1.z.string().max(200, 'Title cannot exceed 200 characters').optional(),
    description: zod_1.z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),
});
