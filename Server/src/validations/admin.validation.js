import { z } from 'zod';

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'User ID is required' }).min(1, 'User ID is required'),
  }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'User ID is required' }).min(1, 'User ID is required'),
  }),
  body: z.object({
    status: z.boolean().or(z.string().transform((v) => v === 'true' || v === '1')).optional(),
    role: z.enum(['Admin', 'Super Admin', 'user', 'Staff', 'admin']).optional(),
  }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    role: z.string().trim().optional(),
    status: z.string().trim().optional(),
    page: z.string().or(z.number()).optional(),
    limit: z.string().or(z.number()).optional(),
    sort: z.string().trim().optional(),
  }).optional(),
});

export default {
  userIdParamSchema,
  updateUserStatusSchema,
  getUsersQuerySchema,
};
