import { z } from 'zod';

export const carIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).min(1, 'Car ID is required'),
  }),
});

export const createCarSchema = z.object({
  name: z
    .string({ required_error: 'Car name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  brand: z.string({ required_error: 'Brand is required' }),
  category: z.string({ required_error: 'Category is required' }),
  model: z.string().trim().optional(),
  modelYear: z.number().or(z.string().transform(Number)).optional(),
  pricePerDay: z.number().or(z.string().transform(Number)).optional(),
  baseRentAmount: z.number().or(z.string().transform(Number)).optional(),
  discount: z.number().min(0).max(100).or(z.string().transform(Number)).optional(),
  securityDeposit: z.number().min(0).or(z.string().transform(Number)).optional(),
  registrationNumber: z.string().trim().optional(),
  drivingMode: z.string().trim().optional(),
  transmission: z.string().trim().optional(),
  driver: z.boolean().or(z.string().transform((v) => v === 'true' || v === '1')).optional(),
  type: z.string().trim().optional(),
  fuelType: z.string().trim().optional(),
  seatingCapacity: z.number().min(1).max(20).or(z.string().transform(Number)).optional(),
  mileage: z.number().min(0).or(z.string().transform(Number)).optional(),
  color: z.string().trim().optional(),
  city: z.string().trim().optional(),
  address: z.any().optional(),
  pic: z.array(z.string()).or(z.string().transform((v) => [v])).optional(),
  images: z.array(z.string()).or(z.string().transform((v) => [v])).optional(),
  features: z.array(z.string()).or(z.string().transform((v) => [v])).optional(),
  specifications: z.object({
    seats: z.number().optional(),
    doors: z.number().optional(),
    luggage: z.number().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    mileage: z.number().optional(),
  }).optional(),
  description: z.string().trim().optional(),
  status: z.boolean().or(z.string().transform((v) => v === 'true' || v === '1')).optional(),
  availabilityStatus: z.enum(['available', 'rented', 'maintenance']).optional(),
});

export const updateCarSchema = createCarSchema.partial();

export default {
  carIdParamSchema,
  createCarSchema,
  updateCarSchema,
};
