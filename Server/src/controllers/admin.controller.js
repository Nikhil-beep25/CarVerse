import * as adminService from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return ApiResponse.success(res, 'Dashboard statistics retrieved successfully', stats);
});

export const getUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await adminService.getAllUsers(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('users'), users, 200, pagination);
});

export const getUser = asyncHandler(async (req, res) => {
  const result = await adminService.getUserById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('User'), result);
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('User account status'), user);
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const { bookings, pagination } = await adminService.getUserBookings(req.params.id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('user bookings'), bookings, 200, pagination);
});

export const getUserPayments = asyncHandler(async (req, res) => {
  const { payments, pagination } = await adminService.getUserPayments(req.params.id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('user payments'), payments, 200, pagination);
});

export default {
  getDashboardStats,
  getUsers,
  getUser,
  updateUserStatus,
  getUserBookings,
  getUserPayments,
};
