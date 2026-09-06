import { z } from 'zod';

import { PaymentGateway } from '../../../generated/prisma/enums';

export const createSubscriptionPaymentValidationSchema = z.object({
    subscriptionId: z.string().uuid('Invalid subscription ID'),

    paymentGateway: z.nativeEnum(PaymentGateway).default(PaymentGateway.BKASH),
});
