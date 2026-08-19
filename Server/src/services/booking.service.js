import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import Payment from '../models/Payment.js';
import * as paymentService from './payment.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import mongoose from 'mongoose';

/**
 * Valid Status Lifecycle Transition State Machine
 */
const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
};

/**
 * Standardize status to UPPERCASE
 */
const normalizeStatus = (status) => {
  if (!status) return 'PENDING';
  const upper = status.toUpperCase();
  if (['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'].includes(upper)) {
    return upper;
  }
  return status;
};

/**
 * Verify vehicle availability for a given date range
 */
export const checkCarAvailability = async (carId, pickupDateStr, dropoffDateStr, excludeBookingId = null) => {
  const car = mongoose.isValidObjectId(carId)
    ? await Car.findById(carId)
    : await Car.findOne({ _id: carId });

  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Car'));
  }

  if (car.status === false) {
    return {
      isAvailable: false,
      reason: 'This vehicle is currently not active in the fleet.',
      car,
    };
  }

  if (car.availabilityStatus === 'maintenance') {
    return {
      isAvailable: false,
      reason: 'This vehicle is currently undergoing scheduled maintenance.',
      car,
    };
  }

  const pickup = new Date(pickupDateStr);
  const dropoff = new Date(dropoffDateStr);

  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    throw new BadRequestError('Invalid pickup or dropoff date format');
  }

  if (pickup >= dropoff) {
    throw new BadRequestError('Dropoff date must be strictly after pickup date');
  }

  // Check for active overlapping bookings:
  // An overlap exists if: (existing.pickupDate < requestedDropoffDate) AND (existing.dropoffDate > requestedPickupDate)
  const overlapQuery = {
    car: car._id,
    bookingStatus: {
      $in: ['PENDING', 'CONFIRMED', 'ACTIVE', 'Pending', 'Confirmed', 'Active'],
    },
    pickupDate: { $lt: dropoff },
    dropoffDate: { $gt: pickup },
  };

  if (excludeBookingId) {
    overlapQuery._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(overlapQuery);

  if (conflictingBooking) {
    return {
      isAvailable: false,
      reason: `Vehicle is already reserved from ${conflictingBooking.pickupDate.toDateString()} to ${conflictingBooking.dropoffDate.toDateString()}.`,
      car,
      conflictingBookingId: conflictingBooking._id,
    };
  }

  return {
    isAvailable: true,
    car,
  };
};

/**
 * Server-Side Rental Price Calculation Engine
 */
export const calculatePriceBreakdown = ({ car, pickupDate, dropoffDate, driverFee, insurance, discount }) => {
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);

  if (start >= end) {
    throw new BadRequestError('Dropoff date must be after pickup date');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (totalDays > 90) {
    throw new BadRequestError('Rental duration cannot exceed 90 days per single booking');
  }

  const dailyRate = car.baseRentAmount || car.pricePerDay || car.finalRentAmount || 0;
  const basePrice = dailyRate * totalDays;
  const isDriver = driverFee === true || driverFee === 'true';
  const isInsurance = insurance === true || insurance === 'true';
  const driverCost = isDriver ? 500 * totalDays : 0;
  const insuranceCost = isInsurance ? 200 * totalDays : 0;
  const securityDeposit = car.securityDeposit || 0;

  const appliedDiscountPct = (discount !== undefined && discount !== null && !isNaN(Number(discount)))
    ? Number(discount)
    : (car.discount || 0);
  const discountAmount = appliedDiscountPct > 0 ? Math.round((basePrice * appliedDiscountPct) / 100) : 0;

  const subTotal = Math.max(0, basePrice + driverCost + insuranceCost - discountAmount);
  const tax = Math.round(subTotal * 0.18); // 18% standard GST
  const totalPrice = subTotal + tax + securityDeposit;

  return {
    totalDays,
    dailyRate,
    basePrice,
    driverCost,
    insuranceCost,
    securityDeposit,
    discountAmount,
    subTotal,
    tax,
    totalPrice,
  };
};

/**
 * Create a new Booking with atomic-level verification and auto-created COD Payment
 */
export const createBooking = async (userId, bookingPayload) => {
  const {
    car: carId,
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    driverFee,
    insurance,
    discount,
    customerNotes,
  } = bookingPayload;

  // 1. Availability check
  const availability = await checkCarAvailability(carId, pickupDate, dropoffDate);
  if (!availability.isAvailable) {
    throw new BadRequestError(availability.reason || 'Vehicle is not available for requested dates');
  }

  const car = availability.car;

  // 2. Server-side price calculation
  const priceCalc = calculatePriceBreakdown({
    car,
    pickupDate,
    dropoffDate,
    driverFee,
    insurance,
    discount,
  });

  // 3. Create Booking record
  const booking = await Booking.create({
    user: userId,
    car: car._id,
    pickupDate: new Date(pickupDate),
    dropoffDate: new Date(dropoffDate),
    pickupLocation,
    dropoffLocation,
    totalDays: priceCalc.totalDays,
    pricePerDay: priceCalc.dailyRate,
    basePrice: priceCalc.basePrice,
    tax: priceCalc.tax,
    insurance: priceCalc.insuranceCost,
    driverFee: priceCalc.driverCost,
    discount: priceCalc.discountAmount,
    securityDeposit: priceCalc.securityDeposit,
    totalPrice: priceCalc.totalPrice,
    customerNotes: customerNotes || '',
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
  });

  // 4. Auto-generate COD Payment Record
  await paymentService.createPaymentForBooking(booking);

  return await Booking.findById(booking._id).populate('car').populate('user', 'name email phone');
};

/**
 * Get Booking by ID (Guarded by Ownership or Admin role)
 */
export const getBookingById = async (id, requestingUser) => {
  const booking = await Booking.findById(id).populate('car').populate('user', 'name email phone');
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking'));
  }

  const isAdmin = ADMIN_ROLES.includes(requestingUser.role);
  const isOwner = booking.user._id.toString() === requestingUser._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError(RESPONSE_MESSAGES.FORBIDDEN);
  }

  return booking;
};

/**
 * Get Customer's Personal Bookings with filter & pagination
 */
export const getUserBookings = async (userId, queryParams = {}) => {
  const filterCriteria = { user: userId };

  if (queryParams.status) {
    const statusUpper = queryParams.status.toUpperCase();
    filterCriteria.bookingStatus = {
      $in: [statusUpper, queryParams.status],
    };
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Booking.countDocuments(filterCriteria);
  const bookings = await Booking.find(filterCriteria)
    .populate('car')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  };

  return { bookings, pagination };
};

/**
 * Get All Bookings (Admin Only) with advanced filtering, search, and pagination
 */
export const getAllBookings = async (queryParams = {}) => {
  const filterCriteria = {};

  // Filter by Status
  if (queryParams.status) {
    const upper = queryParams.status.toUpperCase();
    filterCriteria.bookingStatus = { $in: [upper, queryParams.status] };
  }

  // Filter by Car
  if (queryParams.car && mongoose.isValidObjectId(queryParams.car)) {
    filterCriteria.car = queryParams.car;
  }

  // Filter by User / Customer
  if (queryParams.user && mongoose.isValidObjectId(queryParams.user)) {
    filterCriteria.user = queryParams.user;
  }

  // Date Range Filtering on Pickup Date
  if (queryParams.dateFrom || queryParams.dateTo) {
    filterCriteria.pickupDate = {};
    if (queryParams.dateFrom) filterCriteria.pickupDate.$gte = new Date(queryParams.dateFrom);
    if (queryParams.dateTo) filterCriteria.pickupDate.$lte = new Date(queryParams.dateTo);
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 50;
  const startIndex = (page - 1) * limit;

  const total = await Booking.countDocuments(filterCriteria);
  const bookings = await Booking.find(filterCriteria)
    .populate('car')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  };

  return { bookings, pagination };
};

/**
 * Update Booking Lifecycle Status (Admin Only)
 */
export const updateBookingStatus = async (id, newStatusRaw, adminNotes = '') => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking'));
  }

  const currentStatus = normalizeStatus(booking.bookingStatus);
  const nextStatus = normalizeStatus(newStatusRaw);

  const allowedNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new BadRequestError(
      `Invalid status transition: Cannot change booking status from '${currentStatus}' to '${nextStatus}'. Allowed transitions: [${allowedNextStatuses.join(', ')}]`
    );
  }

  booking.bookingStatus = nextStatus;
  if (adminNotes) {
    booking.adminNotes = adminNotes;
  }

  // Adjust car availability status accordingly
  if (nextStatus === 'ACTIVE') {
    await Car.findByIdAndUpdate(booking.car, { availabilityStatus: 'rented' });
  } else if (nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED' || nextStatus === 'REJECTED') {
    await Car.findByIdAndUpdate(booking.car, { availabilityStatus: 'available' });
  }

  await booking.save();
  return await Booking.findById(id).populate('car').populate('user', 'name email phone');
};

/**
 * Cancel Booking (Customer Owner or Admin)
 */
export const cancelBooking = async (id, requestingUser, reason = 'Cancelled by user') => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking'));
  }

  const isAdmin = ADMIN_ROLES.includes(requestingUser.role);
  const isOwner = booking.user.toString() === requestingUser._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError(RESPONSE_MESSAGES.FORBIDDEN);
  }

  const currentStatus = normalizeStatus(booking.bookingStatus);
  if (!['PENDING', 'CONFIRMED'].includes(currentStatus)) {
    throw new BadRequestError(
      `Cannot cancel booking in '${currentStatus}' status. Only PENDING or CONFIRMED bookings can be cancelled.`
    );
  }

  booking.bookingStatus = 'CANCELLED';
  booking.cancellationReason = reason;
  booking.cancelledBy = requestingUser._id;
  booking.cancelledAt = new Date();

  await booking.save();

  // Reset vehicle status if needed
  await Car.findByIdAndUpdate(booking.car, { availabilityStatus: 'available' });

  // Sync Payment cancellation
  const payment = await Payment.findOne({ booking: id });
  if (payment && payment.paymentStatus.toUpperCase() === 'PENDING') {
    await paymentService.cancelPayment(payment._id, reason);
  }

  return await Booking.findById(id).populate('car').populate('user', 'name email phone');
};

/**
 * Delete Booking (Admin Only)
 */
export const deleteBooking = async (id) => {
  await Payment.findOneAndDelete({ booking: id });
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking'));
  }
  return booking;
};

export default {
  checkCarAvailability,
  calculatePriceBreakdown,
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
};
