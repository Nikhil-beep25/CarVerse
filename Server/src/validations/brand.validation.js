import { z } from 'zod';

export const brandIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Brand ID is required' }).min(1, 'Brand ID is required'),
  }),
});

export const createBrandSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Brand name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    pic: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Brand ID is required' }).min(1, 'Brand ID is required'),
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    pic: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export default {
  brandIdParamSchema,
  createBrandSchema,
  updateBrandSchema,
};
