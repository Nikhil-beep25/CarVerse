import { z } from 'zod';

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }).min(1, 'Category ID is required'),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    pic: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Category ID is required' }).min(1, 'Category ID is required'),
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    pic: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export default {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
};
