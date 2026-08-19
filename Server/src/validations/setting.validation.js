import { z } from 'zod';

export const createSettingSchema = z.object({
  siteName: z.string().optional(),
  address: z.string().optional(),
  map1: z.string().optional(),
  map2: z.string().optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  github: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  privacyPolicy: z.string().optional(),
  dataPolicy: z.string().optional(),
});

export const updateSettingSchema = createSettingSchema.partial();
