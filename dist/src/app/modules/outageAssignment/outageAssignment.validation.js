"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutageAssignmentValidation = void 0;
const zod_1 = require("zod");
const createOutageAssignmentValidationSchema = zod_1.z.object({
    outageId: zod_1.z
        .string({ message: 'Outage ID is required' })
        .uuid('Invalid outage ID'),
    technicianId: zod_1.z
        .string({ message: 'Technician ID is required' })
        .uuid('Invalid technician ID'),
});
const updateOutageAssignmentValidationSchema = zod_1.z.object({
    status: zod_1.z
        .enum(['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .optional(),
    acceptedAt: zod_1.z
        .string()
        .datetime({ message: 'Invalid acceptedAt datetime' })
        .nullable()
        .optional(),
    startedAt: zod_1.z
        .string()
        .datetime({ message: 'Invalid startedAt datetime' })
        .nullable()
        .optional(),
    completedAt: zod_1.z
        .string()
        .datetime({ message: 'Invalid completedAt datetime' })
        .nullable()
        .optional(),
});
exports.OutageAssignmentValidation = {
    createOutageAssignmentValidationSchema,
    updateOutageAssignmentValidationSchema,
};
