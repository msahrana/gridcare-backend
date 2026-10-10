"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutageReportValidation = void 0;
const zod_1 = require("zod");
const createOutageReportSchema = zod_1.z.object({
    outageId: zod_1.z.string().uuid('Invalid outage ID').optional(),
    areaId: zod_1.z.string().uuid('Invalid area ID'),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),
    latitude: zod_1.z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional(),
    longitude: zod_1.z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional(),
});
const updateOutageReportSchema = zod_1.z.object({
    outageId: zod_1.z.string().uuid('Invalid outage ID').nullable().optional(),
    areaId: zod_1.z.string().uuid('Invalid area ID').optional(),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),
    latitude: zod_1.z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .nullable()
        .optional(),
    longitude: zod_1.z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .nullable()
        .optional(),
});
exports.OutageReportValidation = {
    createOutageReportSchema,
    updateOutageReportSchema,
};
