import { z } from 'zod';

export const createRestorationValidationSchema = z.object({
    outageId: z.string().uuid('Invalid outage ID'),
    technicianId: z.string().uuid('Invalid technician ID'),
    remarks: z
        .string()
        .max(1000, 'Remarks cannot exceed 1000 characters')
        .optional(),
});

export const updateRestorationValidationSchema = z.object({
    remarks: z
        .string()
        .max(1000, 'Remarks cannot exceed 1000 characters')
        .optional(),
});
