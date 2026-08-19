import { z } from 'zod';

export const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Booking ID is required' }).min(1, 'Booking ID is required'),
  }),
});

export const checkAvailabilitySchema = z.object({
  query: z.object({
    car: z.string({ required_error: 'Car ID is required' }),
    pickupDate: z.string({ required_error: 'Pickup date is required' }),
    dropoffDate: z.string({ required_error: 'Dropoff date is required' }),
    driverFee: z.string().or(z.boolean()).optional(),
    insurance: z.string().or(z.boolean()).optional(),
    discount: z.string().or(z.number()).optional(),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    car: z.string({ required_error: 'Car ID is required' }),
    pickupDate: z.string({ required_error: 'Pickup date is required' }),
    dropoffDate: z.string({ required_error: 'Dropoff date is required' }),
    pickupLocation: z.string({ required_error: 'Pickup location is required' }).trim().min(2, 'Pickup location too short'),
    dropoffLocation: z.string({ required_error: 'Dropoff location is required' }).trim().min(2, 'Dropoff location too short'),
    driverFee: z.boolean().or(z.string().transform((v) => v === 'true' || v === '1')).optional(),
    insurance: z.boolean().or(z.string().transform((v) => v === 'true' || v === '1')).optional(),
    discount: z.number().or(z.string().transform(Number)).optional(),
    customerNotes: z.string().trim().optional(),
  }),
});

export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Booking ID is required' }).min(1, 'Booking ID is required'),
  }),
  body: z.object({
    reason: z.string().trim().min(3, 'Cancellation reason must be at least 3 characters').optional(),
  }).optional(),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Booking ID is required' }).min(1, 'Booking ID is required'),
  }),
  body: z.object({
    status: z.string({ required_error: 'Status is required' }).trim(),
    adminNotes: z.string().trim().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string({ required_error: 'Razorpay order ID is required' }),
    razorpay_payment_id: z.string({ required_error: 'Razorpay payment ID is required' }),
    razorpay_signature: z.string({ required_error: 'Razorpay signature is required' }),
    booking_id: z.string({ required_error: 'Booking ID is required' }),
  }),
});

export default {
  bookingIdParamSchema,
  checkAvailabilitySchema,
  createBookingSchema,
  cancelBookingSchema,
  updateBookingStatusSchema,
  verifyPaymentSchema,
};
