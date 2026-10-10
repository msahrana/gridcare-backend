"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutageValidation = void 0;
const zod_1 = require("zod");
const createOutageSchema = zod_1.z.object({
    areaId: zod_1.z.string().uuid('Invalid area ID'),
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: zod_1.z.string().max(1000).optional(),
    type: zod_1.z.enum(['PLANNED', 'UNEXPECTED']),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: zod_1.z
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
    startedAt: zod_1.z.coerce.date().optional(),
    restoredAt: zod_1.z.coerce.date().optional(),
});
const updateOutageSchema = zod_1.z.object({
    areaId: zod_1.z.string().uuid('Invalid area ID').optional(),
    title: zod_1.z.string().min(3).max(200).optional(),
    description: zod_1.z.string().max(1000).nullable().optional(),
    type: zod_1.z.enum(['PLANNED', 'UNEXPECTED']).optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: zod_1.z
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
    startedAt: zod_1.z.coerce.date().nullable().optional(),
    restoredAt: zod_1.z.coerce.date().nullable().optional(),
});
exports.OutageValidation = {
    createOutageSchema,
    updateOutageSchema,
};
