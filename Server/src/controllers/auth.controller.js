import * as authService from '../services/auth.service.js';
import { sendTokenResponse } from '../helpers/token.helper.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  sendTokenResponse(user, HTTP_STATUS.CREATED, res, RESPONSE_MESSAGES.REGISTER_SUCCESS);
});

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const user = await authService.loginUser(req.body);
  sendTokenResponse(user, HTTP_STATUS.OK, res, RESPONSE_MESSAGES.LOGIN_SUCCESS);
});

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED('User Profile'), user);
});

/**
 * @desc    Update current logged in user profile
 * @route   PUT /api/v1/auth/profile or /updateprofile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Profile'), user);
});

/**
 * @desc    Change password for logged in user
 * @route   PUT /api/v1/auth/change-password or /changepassword
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  await authService.changeUserPassword(req.user._id, req.body);
  return ApiResponse.success(res, 'Password changed successfully', {});
});

/**
 * @desc    Request password reset email
 * @route   POST /api/v1/auth/forgot-password or /forgotpassword
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return ApiResponse.success(
    res,
    'Password reset instructions sent to your email address',
    result
  );
});

/**
 * @desc    Reset password using recovery token
 * @route   POST /api/v1/auth/reset-password or PUT /resetpassword/:resetToken
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token || req.params.resetToken || req.body.token;
  const newPassword = req.body.password;

  const user = await authService.resetPassword(token, newPassword);
  sendTokenResponse(user, HTTP_STATUS.OK, res, 'Password reset successful. You are now logged in.');
});

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/v1/auth/logout or GET /api/v1/auth/logout
 * @access  Public / Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return ApiResponse.success(res, RESPONSE_MESSAGES.LOGOUT_SUCCESS, {});
});

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
};
