import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as analyticsController from '../controllers/analytics.controller.js';
import analyticsRoutes from './analytics.routes.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  userIdParamSchema,
  updateUserStatusSchema,
} from '../validations/admin.validation.js';
import { reportRequestSchema } from '../validations/analytics.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

// 1. Mount Analytics & Reports Sub-routes
router.use('/analytics', analyticsRoutes);

// Direct Report Export Endpoints: /api/v1/admin/reports/:type
router.get(
  '/reports/:type',
  protect,
  authorize(...ADMIN_ROLES),
  validate(reportRequestSchema),
  analyticsController.getReport
);

router.get(
  '/report/:type',
  protect,
  authorize(...ADMIN_ROLES),
  validate(reportRequestSchema),
  analyticsController.getReport
);

// 2. Dashboard Live Statistics
router.get(
  '/dashboard/stats',
  protect,
  authorize(...ADMIN_ROLES),
  adminController.getDashboardStats
);

router.get(
  '/stats',
  protect,
  authorize(...ADMIN_ROLES),
  adminController.getDashboardStats
);

// 3. User Management
router.get(
  '/users',
  protect,
  authorize(...ADMIN_ROLES),
  adminController.getUsers
);

router.get(
  '/users/:id',
  protect,
  authorize(...ADMIN_ROLES),
  validate(userIdParamSchema),
  adminController.getUser
);

router.put(
  '/users/:id/status',
  protect,
  authorize(...ADMIN_ROLES),
  validate(updateUserStatusSchema),
  adminController.updateUserStatus
);

router.get(
  '/users/:id/bookings',
  protect,
  authorize(...ADMIN_ROLES),
  validate(userIdParamSchema),
  adminController.getUserBookings
);

router.get(
  '/users/:id/payments',
  protect,
  authorize(...ADMIN_ROLES),
  validate(userIdParamSchema),
  adminController.getUserPayments
);

export default router;
