import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  analyticsQuerySchema,
  reportRequestSchema,
} from '../validations/analytics.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

// Guard all Analytics and Reports endpoints for Admin roles only
router.use(protect);
router.use(authorize(...ADMIN_ROLES));

// 1. Analytics Overview
router.get('/overview', validate(analyticsQuerySchema), analyticsController.getOverview);

// 2. Booking Trends
router.get('/bookings', validate(analyticsQuerySchema), analyticsController.getBookingTrends);

// 3. Revenue / COD Trends
router.get('/revenue', validate(analyticsQuerySchema), analyticsController.getRevenueTrends);

// 4. Car Performance
router.get('/cars', validate(analyticsQuerySchema), analyticsController.getCarPerformance);

// 5. Category Performance
router.get('/categories', validate(analyticsQuerySchema), analyticsController.getCategoryPerformance);

// 6. Customer Analytics
router.get('/customers', validate(analyticsQuerySchema), analyticsController.getCustomerAnalytics);

// 7. Tabular Reports & CSV Export
router.get('/reports/:type', validate(reportRequestSchema), analyticsController.getReport);

export default router;
