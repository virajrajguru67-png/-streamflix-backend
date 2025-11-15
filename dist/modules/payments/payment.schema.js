import { z } from 'zod';
export const paymentAuditSchema = z.object({
    transactionId: z.string().min(1),
    status: z.string().min(1),
    method: z.string().min(1),
    amount: z.number().nonnegative(),
    movieTitle: z.string().min(1),
    showtime: z.string().optional(),
    seats: z.array(z.string().min(1)).optional(),
});
export const createOrderSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().default('INR'),
    metadata: z.record(z.string()).optional(),
});
export const verifyPaymentSchema = z.object({
    orderId: z.string().min(1),
    paymentId: z.string().min(1),
    signature: z.string().min(1),
});
//# sourceMappingURL=payment.schema.js.map