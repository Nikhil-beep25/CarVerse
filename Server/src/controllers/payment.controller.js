import * as paymentService from '../services/payment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getPayments = asyncHandler(async (req, res) => {
  const { payments, pagination } = await paymentService.getAllPayments(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('payments'), payments, 200, pagination);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const { payments, pagination } = await paymentService.getUserPayments(req.user._id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('user payments'), payments, 200, pagination);
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id, req.user);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Payment'), payment);
});

export const getPaymentByBooking = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentByBookingId(req.params.bookingId, req.user);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Payment'), payment);
});

export const collectCashPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.collectCashPayment(
    req.params.id,
    req.user,
    req.body?.notes
  );
  return ApiResponse.success(res, 'Cash payment collected successfully. Receipt generated.', payment);
});

export const cancelPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.cancelPayment(req.params.id, req.body?.reason);
  return ApiResponse.success(res, 'Payment cancelled successfully', payment);
});

export const getPaymentReceipt = asyncHandler(async (req, res) => {
  const receipt = await paymentService.getPaymentReceipt(req.params.id, req.user);
  return ApiResponse.success(res, 'Receipt retrieved successfully', receipt);
});

export default {
  getPayments,
  getMyPayments,
  getPayment,
  getPaymentByBooking,
  collectCashPayment,
  cancelPayment,
  getPaymentReceipt,
};
