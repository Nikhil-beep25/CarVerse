import { z } from 'zod';

export const paymentIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Payment ID is required' }).min(1, 'Payment ID is required'),
  }),
});

export const bookingIdParamSchema = z.object({
  params: z.object({
    bookingId: z.string({ required_error: 'Booking ID is required' }).min(1, 'Booking ID is required'),
  }),
});

export const collectPaymentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Payment ID is required' }).min(1, 'Payment ID is required'),
  }),
  body: z.object({
    notes: z.string().trim().optional(),
  }).optional(),
});

export const cancelPaymentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Payment ID is required' }).min(1, 'Payment ID is required'),
  }),
  body: z.object({
    reason: z.string().trim().optional(),
  }).optional(),
});

export default {
  paymentIdParamSchema,
  bookingIdParamSchema,
  collectPaymentSchema,
  cancelPaymentSchema,
};
