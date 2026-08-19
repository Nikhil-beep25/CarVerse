import { z } from 'zod';

const analyticsQueryObject = z
  .object({
    preset: z
      .enum([
        'today',
        'yesterday',
        '7days',
        '30days',
        'thisMonth',
        'lastMonth',
        'thisYear',
        'all',
      ])
      .optional(),
    dateFrom: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
    dateTo: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
    year: z.string().regex(/^\d{4}$/).or(z.number()).optional(),
    limit: z.string().or(z.number()).optional(),
    sort: z.string().trim().optional(),
    format: z.enum(['json', 'csv']).optional(),
  })
  .optional()
  .refine(
    (data) => {
      if (data?.dateFrom && data?.dateTo) {
        const from = new Date(data.dateFrom);
        const to = new Date(data.dateTo);
        return from <= to;
      }
      return true;
    },
    { message: 'dateFrom must be earlier than or equal to dateTo', path: ['dateFrom'] }
  );

export const analyticsQuerySchema = z.object({
  query: analyticsQueryObject,
});

export const reportRequestSchema = z.object({
  params: z.object({
    type: z.enum(['bookings', 'payments', 'cars', 'customers']),
  }),
  query: analyticsQueryObject,
});

export default {
  analyticsQuerySchema,
  reportRequestSchema,
};
