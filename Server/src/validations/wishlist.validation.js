import { z } from 'zod';

export const wishlistCarParamSchema = z.object({
  params: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).min(1, 'Car ID is required'),
  }),
});

export default {
  wishlistCarParamSchema,
};
