import { z } from 'zod';

import { UserRole } from '../../../generated/prisma/enums';

export const updateUserRoleValidationSchema = z.object({
    role: z.enum(UserRole),
});
