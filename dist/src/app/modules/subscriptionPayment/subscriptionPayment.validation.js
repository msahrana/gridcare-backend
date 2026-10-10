"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionPaymentValidationSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../generated/prisma/enums");
exports.createSubscriptionPaymentValidationSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string().uuid('Invalid subscription ID'),
    paymentGateway: zod_1.z.nativeEnum(enums_1.PaymentGateway).default(enums_1.PaymentGateway.BKASH),
});
