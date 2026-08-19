import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100, 'Name too long'),
  icon: z.string().min(1, 'Service icon is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  status: z.union([z.boolean(), z.string().transform((v) => v === 'true' || v === '1')]).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
