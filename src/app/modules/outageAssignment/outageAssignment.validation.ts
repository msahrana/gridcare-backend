import { z } from 'zod';

const createOutageAssignmentValidationSchema = z.object({
    outageId: z
        .string({ message: 'Outage ID is required' })
        .uuid('Invalid outage ID'),

    technicianId: z
        .string({ message: 'Technician ID is required' })
        .uuid('Invalid technician ID'),
});

const updateOutageAssignmentValidationSchema = z.object({
    status: z
        .enum(['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .optional(),

    acceptedAt: z
        .string()
        .datetime({ message: 'Invalid acceptedAt datetime' })
        .nullable()
        .optional(),

    startedAt: z
        .string()
        .datetime({ message: 'Invalid startedAt datetime' })
        .nullable()
        .optional(),

    completedAt: z
        .string()
        .datetime({ message: 'Invalid completedAt datetime' })
        .nullable()
        .optional(),
});

export const OutageAssignmentValidation = {
    createOutageAssignmentValidationSchema,
    updateOutageAssignmentValidationSchema,
};
