import crypto from 'crypto';
import User from '../models/User.js';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { ROLES } from '../constants/roles.js';
import { sendEmail } from './email.service.js';
import { env } from '../config/env.js';

/**
 * Register a new user
 */
export const registerUser = async ({ name, username, email, password, phone, address }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new BadRequestError(RESPONSE_MESSAGES.USER_EXISTS);
  }

  // Enforce default user role for public registration
  const user = await User.create({
    name: name.trim(),
    username: username ? username.trim() : undefined,
    email: normalizedEmail,
    password,
    phone: phone ? phone.trim() : '',
    address: address ? address.trim() : '',
    role: ROLES.USER,
    accountStatus: 'active',
  });

  return user;
};

/**
 * Authenticate user credentials and return user document
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
  }

  if (user.accountStatus === 'suspended') {
    throw new ForbiddenError('Your account has been suspended. Please contact customer support.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
  }

  return user;
};

/**
 * Retrieve user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

/**
 * Update editable profile fields
 */
export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = {};
  if (updateData.name !== undefined) allowedFields.name = updateData.name.trim();
  if (updateData.phone !== undefined) allowedFields.phone = updateData.phone.trim();
  if (updateData.address !== undefined) allowedFields.address = updateData.address.trim();
  if (updateData.avatar !== undefined) allowedFields.avatar = updateData.avatar;

  const user = await User.findByIdAndUpdate(
    userId,
    allowedFields,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

/**
 * Change password for authenticated user
 */
export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new BadRequestError('Current password does not match');
  }

  user.password = newPassword;
  await user.save();

  return true;
};

/**
 * Generate password reset token and send recovery instructions
 */
export const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new NotFoundError(`No user found with email: ${normalizedEmail}`);
  }

  // Generate reset token (stored hashed, raw returned)
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Build reset URL
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because a password reset request was submitted for your CarVerse account.\n\nPlease click the link below or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis reset link is valid for 15 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #e60023; text-align: center;">CarVerse Password Reset</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You requested a password reset for your account. Please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #e60023; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 13px;">This link will expire in 15 minutes.</p>
      <p style="color: #666; font-size: 13px;">If you did not request a password reset, no further action is required.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} CarVerse. All rights reserved.</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'CarVerse - Password Reset Request',
      message,
      html,
    });

    return {
      success: true,
      resetToken,
      resetUrl,
    };
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new BadRequestError('Email could not be sent. Please try again later.');
  }
};

/**
 * Reset user password with token
 */
export const resetPassword = async (rawToken, newPassword) => {
  if (!rawToken) {
    throw new BadRequestError('Reset token is required');
  }

  // Hash the raw token to match against the DB record
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError('Password reset token is invalid or has expired');
  }

  // Update password and clear reset token fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};

export default {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  changeUserPassword,
  forgotPassword,
  resetPassword,
};
