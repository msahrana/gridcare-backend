import { z } from 'zod';

import { PaymentGateway } from '../../../generated/prisma/enums';

export const createSubscriptionPaymentValidationSchema = z.object({
    planId: z.string().uuid('Invalid plan ID'),

    paymentGateway: z.nativeEnum(PaymentGateway).default(PaymentGateway.BKASH),
});
