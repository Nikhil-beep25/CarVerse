import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  paymentIdParamSchema,
  bookingIdParamSchema,
  collectPaymentSchema,
  cancelPaymentSchema,
} from '../validations/payment.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

// 1. Customer Personal Payments
router.get('/my-payments', protect, paymentController.getMyPayments);
router.get('/me', protect, paymentController.getMyPayments);

// 2. Admin List All Payments
router.get('/', protect, authorize(...ADMIN_ROLES), paymentController.getPayments);

// 3. Payment by Booking ID (Owner or Admin)
router.get(
  '/booking/:bookingId',
  protect,
  validate(bookingIdParamSchema),
  paymentController.getPaymentByBooking
);

// 4. Payment Receipt (Owner or Admin)
router.get(
  '/:id/receipt',
  protect,
  validate(paymentIdParamSchema),
  paymentController.getPaymentReceipt
);

// 5. Single Payment Details (Owner or Admin)
router.get(
  '/:id',
  protect,
  validate(paymentIdParamSchema),
  paymentController.getPayment
);

// 6. Collect Cash Payment (Admin Only)
router.put(
  '/:id/collect',
  protect,
  authorize(...ADMIN_ROLES),
  validate(collectPaymentSchema),
  paymentController.collectCashPayment
);

// 7. Cancel Payment (Admin Only)
router.put(
  '/:id/cancel',
  protect,
  authorize(...ADMIN_ROLES),
  validate(cancelPaymentSchema),
  paymentController.cancelPayment
);

export default router;
