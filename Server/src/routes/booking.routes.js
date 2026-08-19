import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createBookingSchema,
  cancelBookingSchema,
  updateBookingStatusSchema,
  bookingIdParamSchema,
  checkAvailabilitySchema,
} from '../validations/booking.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

// 1. Availability check (Public or Protected)
router.get('/availability', validate(checkAvailabilitySchema), bookingController.checkAvailability);

// 2. Customer Bookings List
router.get('/mybookings', protect, bookingController.getMyBookings);
router.get('/my-bookings', protect, bookingController.getMyBookings);
router.get('/me', protect, bookingController.getMyBookings);

// 3. Create Booking
router.post('/', protect, validate(createBookingSchema), bookingController.createBooking);

// 4. Admin View All Bookings
router.get('/', protect, authorize(...ADMIN_ROLES), bookingController.getBookings);

// 5. Booking Details (Owner or Admin)
router.get('/:id', protect, validate(bookingIdParamSchema), bookingController.getBooking);

// 6. Cancel Booking (Owner or Admin)
router.put('/:id/cancel', protect, validate(cancelBookingSchema), bookingController.cancelBooking);

// 7. Update Status (Admin Only)
router.put(
  '/:id/status',
  protect,
  authorize(...ADMIN_ROLES),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

// 8. Backward Compatibility: PUT /:id for status
router.put(
  '/:id',
  protect,
  authorize(...ADMIN_ROLES),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

// 9. Delete Booking (Admin Only)
router.delete(
  '/:id',
  protect,
  authorize(...ADMIN_ROLES),
  validate(bookingIdParamSchema),
  bookingController.deleteBooking
);

export default router;
