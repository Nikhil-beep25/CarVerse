import * as bookingService from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const checkAvailability = asyncHandler(async (req, res) => {
  const { car, pickupDate, dropoffDate, driverFee, insurance, discount } = req.query;
  const availability = await bookingService.checkCarAvailability(car, pickupDate, dropoffDate);

  if (!availability.isAvailable) {
    return ApiResponse.success(res, 'Vehicle availability check completed', {
      available: false,
      reason: availability.reason,
    });
  }

  const priceBreakdown = bookingService.calculatePriceBreakdown({
    car: availability.car,
    pickupDate,
    dropoffDate,
    driverFee: driverFee === 'true' || driverFee === true,
    insurance: insurance === 'true' || insurance === true,
    discount,
  });

  return ApiResponse.success(res, 'Vehicle is available for the selected dates', {
    available: true,
    priceBreakdown,
  });
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user._id, req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Booking'), booking);
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id, req.user);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Booking'), booking);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { bookings, pagination } = await bookingService.getUserBookings(req.user._id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('user bookings'), bookings, 200, pagination);
});

export const getBookings = asyncHandler(async (req, res) => {
  const { bookings, pagination } = await bookingService.getAllBookings(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('bookings'), bookings, 200, pagination);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user, req.body?.reason);
  return ApiResponse.success(res, 'Booking cancelled successfully', booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    req.body.status,
    req.body.adminNotes
  );
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Booking status'), booking);
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.deleteBooking(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Booking'), booking);
});

export default {
  checkAvailability,
  createBooking,
  getBooking,
  getMyBookings,
  getBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
};
