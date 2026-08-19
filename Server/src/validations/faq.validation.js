import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required'),
  status: z.union([z.boolean(), z.string().transform((v) => v === 'true' || v === '1')]).optional(),
});

export const updateFaqSchema = createFaqSchema.partial();
