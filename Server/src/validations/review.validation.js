import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).min(1, 'Car ID is required'),
    bookingId: z.string({ required_error: 'Booking ID is required' }).min(1, 'Booking ID is required'),
    rating: z
      .number({ required_error: 'Rating is required' })
      .int('Rating must be a whole number')
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'),
    title: z.string().trim().max(100, 'Title cannot exceed 100 characters').optional(),
    comment: z
      .string({ required_error: 'Comment is required' })
      .trim()
      .min(5, 'Comment must be at least 5 characters long')
      .max(1000, 'Comment cannot exceed 1000 characters'),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Review ID is required' }).min(1, 'Review ID is required'),
  }),
  body: z.object({
    rating: z
      .number()
      .int('Rating must be a whole number')
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5')
      .optional(),
    title: z.string().trim().max(100, 'Title cannot exceed 100 characters').optional(),
    comment: z
      .string()
      .trim()
      .min(5, 'Comment must be at least 5 characters long')
      .max(1000, 'Comment cannot exceed 1000 characters')
      .optional(),
  }),
});

export const reviewIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Review ID is required' }).min(1, 'Review ID is required'),
  }),
});

export const carIdParamSchema = z.object({
  params: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).min(1, 'Car ID is required'),
  }),
});

export default {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
  carIdParamSchema,
};
