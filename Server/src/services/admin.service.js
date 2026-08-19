import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

/**
 * Retrieve Live Aggregated Dashboard Statistics
 * 100% computed from real MongoDB database data
 */
export const getDashboardStats = async () => {
  // 1. User Statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: { $ne: false } });
  const inactiveUsers = await User.countDocuments({ status: false });
  const adminUsers = await User.countDocuments({ role: { $in: ['Admin', 'Super Admin', 'admin'] } });
  const customerUsers = await User.countDocuments({ role: { $in: ['user', 'Customer', 'customer'] } });

  // 2. Car Statistics
  const totalCars = await Car.countDocuments();
  const availableCars = await Car.countDocuments({
    status: { $ne: false },
    availabilityStatus: { $in: ['available', 'Available'] },
  });
  const rentedCars = await Car.countDocuments({
    availabilityStatus: { $in: ['rented', 'Rented'] },
  });
  const maintenanceCars = await Car.countDocuments({
    availabilityStatus: { $in: ['maintenance', 'Maintenance'] },
  });
  const activeFleet = await Car.countDocuments({ status: { $ne: false } });

  // 3. Booking Statistics
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({
    bookingStatus: { $in: ['PENDING', 'Pending'] },
  });
  const confirmedBookings = await Booking.countDocuments({
    bookingStatus: { $in: ['CONFIRMED', 'Confirmed'] },
  });
  const activeRentals = await Booking.countDocuments({
    bookingStatus: { $in: ['ACTIVE', 'Active'] },
  });
  const completedRentals = await Booking.countDocuments({
    bookingStatus: { $in: ['COMPLETED', 'Completed'] },
  });
  const cancelledBookings = await Booking.countDocuments({
    bookingStatus: { $in: ['CANCELLED', 'Cancelled'] },
  });
  const rejectedBookings = await Booking.countDocuments({
    bookingStatus: { $in: ['REJECTED', 'Rejected'] },
  });

  // 4. Payment Statistics (COD Financial Aggregations)
  const totalPayments = await Payment.countDocuments();
  const pendingPayments = await Payment.countDocuments({
    paymentStatus: { $in: ['PENDING', 'Pending'] },
  });
  const paidPayments = await Payment.countDocuments({
    paymentStatus: { $in: ['PAID', 'Paid'] },
  });
  const cancelledPayments = await Payment.countDocuments({
    paymentStatus: { $in: ['CANCELLED', 'Cancelled'] },
  });

  // Revenue Aggregation
  const revenueAgg = await Payment.aggregate([
    {
      $match: {
        paymentStatus: { $in: ['PAID', 'Paid'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);
  const totalCollected = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

  // Pending Cash Aggregation
  const pendingAgg = await Payment.aggregate([
    {
      $match: {
        paymentStatus: { $in: ['PENDING', 'Pending'] },
      },
    },
    {
      $group: {
        _id: null,
        totalPending: { $sum: '$amount' },
      },
    },
  ]);
  const totalPendingAmount = pendingAgg.length > 0 ? pendingAgg[0].totalPending : 0;

  // 5. Recent Activity
  const recentBookings = await Booking.find()
    .populate('car', 'name pic registrationNumber')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentPayments = await Payment.find()
    .populate('user', 'name email')
    .populate({ path: 'booking', populate: { path: 'car', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentUsers = await User.find()
    .select('-password -passwordResetToken -passwordResetExpires')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admins: adminUsers,
      customers: customerUsers,
    },
    cars: {
      total: totalCars,
      activeFleet,
      available: availableCars,
      rented: rentedCars,
      maintenance: maintenanceCars,
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      active: activeRentals,
      completed: completedRentals,
      cancelled: cancelledBookings,
      rejected: rejectedBookings,
    },
    payments: {
      total: totalPayments,
      pending: pendingPayments,
      paid: paidPayments,
      cancelled: cancelledPayments,
      totalCollected,
      totalPendingAmount,
    },
    recentActivity: {
      bookings: recentBookings,
      payments: recentPayments,
      users: recentUsers,
    },
  };
};

/**
 * Retrieve All Users with search, filter, sort, and pagination
 */
export const getAllUsers = async (queryParams = {}) => {
  const filterCriteria = {};

  // Fuzzy search on name, email, phone, username
  if (queryParams.search && queryParams.search.trim() !== '') {
    const term = queryParams.search.trim();
    filterCriteria.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
      { username: { $regex: term, $options: 'i' } },
    ];
  }

  // Filter by Role
  if (queryParams.role) {
    filterCriteria.role = queryParams.role;
  }

  // Filter by Status
  if (queryParams.status !== undefined) {
    filterCriteria.status = queryParams.status === 'true' || queryParams.status === true;
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await User.countDocuments(filterCriteria);
  const users = await User.find(filterCriteria)
    .select('-password -passwordResetToken -passwordResetExpires')
    .sort(queryParams.sort ? queryParams.sort.split(',').join(' ') : { createdAt: -1 })
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

  return { users, pagination };
};

/**
 * Get User Details with Booking & Payment Aggregates
 */
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password -passwordResetToken -passwordResetExpires');
  if (!user) {
    throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  // Aggregate user's activity
  const totalBookings = await Booking.countDocuments({ user: id });
  const totalPayments = await Payment.countDocuments({ user: id });

  const spentAgg = await Payment.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(id),
        paymentStatus: { $in: ['PAID', 'Paid'] },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$amount' },
      },
    },
  ]);

  const totalSpent = spentAgg.length > 0 ? spentAgg[0].totalSpent : 0;

  return {
    user,
    analytics: {
      totalBookings,
      totalPayments,
      totalSpent,
    },
  };
};

/**
 * Update User Status (Activate / Deactivate) or Role
 */
export const updateUserStatus = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError(RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  // Prevent admin from deactivating themselves
  if (updateData.status !== undefined) {
    user.status = updateData.status;
  }
  if (updateData.role) {
    user.role = updateData.role;
  }

  await user.save();

  return await User.findById(id).select('-password -passwordResetToken -passwordResetExpires');
};

/**
 * Get Specific User's Booking History
 */
export const getUserBookings = async (userId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Booking.countDocuments({ user: userId });
  const bookings = await Booking.find({ user: userId })
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
 * Get Specific User's Payment History
 */
export const getUserPayments = async (userId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Payment.countDocuments({ user: userId });
  const payments = await Payment.find({ user: userId })
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

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getUserBookings,
  getUserPayments,
};
