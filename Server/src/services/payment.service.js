import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import mongoose from 'mongoose';

/**
 * Generate a clean, unique Receipt Number
 */
const generateReceiptNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `REC-${datePart}-${randomPart}`;
};

/**
 * Standardize status to UPPERCASE
 */
const normalizePaymentStatus = (status) => {
  if (!status) return 'PENDING';
  const upper = status.toUpperCase();
  if (['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'].includes(upper)) {
    return upper;
  }
  return status;
};

/**
 * Initialize COD Payment Record for a created Booking
 */
export const createPaymentForBooking = async (bookingDoc) => {
  // Check if payment already exists for this booking
  const existing = await Payment.findOne({ booking: bookingDoc._id });
  if (existing) {
    return existing;
  }

  const payment = await Payment.create({
    booking: bookingDoc._id,
    user: bookingDoc.user,
    amount: bookingDoc.totalPrice,
    currency: 'INR',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    notes: 'Cash on Delivery payment to be collected at vehicle handover.',
  });

  return payment;
};

/**
 * Get Payment by ID with IDOR authorization check
 */
export const getPaymentById = async (id, requestingUser) => {
  const payment = await Payment.findById(id)
    .populate('booking')
    .populate('user', 'name email phone')
    .populate('collectedBy', 'name email');

  if (!payment) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Payment'));
  }

  const isAdmin = ADMIN_ROLES.includes(requestingUser.role);
  const isOwner = payment.user._id.toString() === requestingUser._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError(RESPONSE_MESSAGES.FORBIDDEN);
  }

  return payment;
};

/**
 * Get Payment by Booking ID
 */
export const getPaymentByBookingId = async (bookingId, requestingUser) => {
  const payment = await Payment.findOne({ booking: bookingId })
    .populate('booking')
    .populate('user', 'name email phone')
    .populate('collectedBy', 'name email');

  if (!payment) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Payment for this booking'));
  }

  const isAdmin = ADMIN_ROLES.includes(requestingUser.role);
  const isOwner = payment.user._id.toString() === requestingUser._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError(RESPONSE_MESSAGES.FORBIDDEN);
  }

  return payment;
};

/**
 * Get Customer's Personal Payment History
 */
export const getUserPayments = async (userId, queryParams = {}) => {
  const filterCriteria = { user: userId };

  if (queryParams.status) {
    const upper = queryParams.status.toUpperCase();
    filterCriteria.paymentStatus = { $in: [upper, queryParams.status] };
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Payment.countDocuments(filterCriteria);
  const payments = await Payment.find(filterCriteria)
    .populate({
      path: 'booking',
      populate: { path: 'car', select: 'name pic registrationNumber' },
    })
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

  return { payments, pagination };
};

/**
 * Get All Payments (Admin Only) with filters and pagination
 */
export const getAllPayments = async (queryParams = {}) => {
  const filterCriteria = {};

  if (queryParams.status || queryParams.paymentStatus) {
    const statusVal = queryParams.status || queryParams.paymentStatus;
    const upper = statusVal.toUpperCase();
    filterCriteria.paymentStatus = { $in: [upper, statusVal] };
  }

  if (queryParams.booking && mongoose.isValidObjectId(queryParams.booking)) {
    filterCriteria.booking = queryParams.booking;
  }

  if (queryParams.user && mongoose.isValidObjectId(queryParams.user)) {
    filterCriteria.user = queryParams.user;
  }

  if (queryParams.dateFrom || queryParams.dateTo) {
    filterCriteria.createdAt = {};
    if (queryParams.dateFrom) filterCriteria.createdAt.$gte = new Date(queryParams.dateFrom);
    if (queryParams.dateTo) filterCriteria.createdAt.$lte = new Date(queryParams.dateTo);
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 50;
  const startIndex = (page - 1) * limit;

  const total = await Payment.countDocuments(filterCriteria);
  const payments = await Payment.find(filterCriteria)
    .populate({
      path: 'booking',
      populate: [
        { path: 'car', select: 'name pic registrationNumber pricePerDay baseRentAmount' },
        { path: 'user', select: 'name email phone' },
      ],
    })
    .populate('user', 'name email phone')
    .populate('collectedBy', 'name email')
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

  return { payments, pagination };
};

/**
 * Collect Cash Payment (Admin Only)
 */
export const collectCashPayment = async (id, adminUser, notes = '') => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Payment'));
  }

  const currentStatus = normalizePaymentStatus(payment.paymentStatus);
  if (currentStatus === 'PAID') {
    throw new BadRequestError('Payment is already marked as PAID.');
  }

  if (currentStatus === 'CANCELLED') {
    throw new BadRequestError('Cannot collect cash for a CANCELLED payment.');
  }

  const booking = await Booking.findById(payment.booking);
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Associated booking'));
  }

  if (['CANCELLED', 'REJECTED'].includes(booking.bookingStatus.toUpperCase())) {
    throw new BadRequestError(`Cannot collect payment for a ${booking.bookingStatus} booking.`);
  }

  // Update Payment Record
  payment.paymentStatus = 'PAID';
  payment.collectedAt = new Date();
  payment.collectedBy = adminUser._id;
  payment.receiptNumber = payment.receiptNumber || generateReceiptNumber();
  if (notes) {
    payment.notes = notes;
  }
  await payment.save();

  // Sync Booking payment status
  booking.paymentStatus = 'PAID';
  await booking.save();

  return await Payment.findById(id)
    .populate({
      path: 'booking',
      populate: { path: 'car', select: 'name pic registrationNumber' },
    })
    .populate('user', 'name email phone')
    .populate('collectedBy', 'name email');
};

/**
 * Cancel Payment (Admin or Internal trigger on Booking Cancel)
 */
export const cancelPayment = async (id, reason = 'Booking cancelled') => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Payment'));
  }

  const currentStatus = normalizePaymentStatus(payment.paymentStatus);
  if (currentStatus === 'PAID') {
    throw new BadRequestError('Cannot cancel an already PAID payment.');
  }

  payment.paymentStatus = 'CANCELLED';
  if (reason) {
    payment.notes = payment.notes ? `${payment.notes} | Cancellation: ${reason}` : `Cancellation: ${reason}`;
  }
  await payment.save();

  // Sync Booking payment status
  await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'CANCELLED' });

  return payment;
};

/**
 * Get Detailed Receipt for Payment
 */
export const getPaymentReceipt = async (id, requestingUser) => {
  const payment = await getPaymentById(id, requestingUser);

  const booking = await Booking.findById(payment.booking)
    .populate('car')
    .populate('user', 'name email phone');

  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking for receipt'));
  }

  return {
    receiptNumber: payment.receiptNumber || 'PENDING-COLLECTION',
    customerName: booking.user?.name || payment.user?.name || 'Valued Customer',
    customerEmail: booking.user?.email || payment.user?.email || '',
    customerPhone: booking.user?.phone || '',
    bookingId: booking._id,
    carName: booking.car?.name || 'Fleet Vehicle',
    registrationNumber: booking.car?.registrationNumber || 'N/A',
    pickupDate: booking.pickupDate,
    dropoffDate: booking.dropoffDate,
    totalDays: booking.totalDays,
    paymentAmount: payment.amount,
    currency: payment.currency || 'INR',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: payment.paymentStatus,
    collectedAt: payment.collectedAt,
    collectedBy: payment.collectedBy ? payment.collectedBy.name : null,
    generatedDate: new Date(),
    breakdown: {
      basePrice: booking.basePrice,
      driverFee: booking.driverFee,
      insurance: booking.insurance,
      discount: booking.discount,
      tax: booking.tax,
      securityDeposit: booking.securityDeposit,
      totalPrice: booking.totalPrice,
    },
  };
};

export default {
  createPaymentForBooking,
  getPaymentById,
  getPaymentByBookingId,
  getUserPayments,
  getAllPayments,
  collectCashPayment,
  cancelPayment,
  getPaymentReceipt,
};
