import mongoose from 'mongoose';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import Category from '../models/Category.js';
import { BadRequestError } from '../errors/index.js';

/**
 * Helper to compute date range filter based on preset or custom date strings
 */
export const resolveDateBoundaries = (query = {}) => {
  const { preset, dateFrom, dateTo } = query;
  const now = new Date();

  if (dateFrom && dateTo) {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid dateFrom or dateTo format');
    }
    if (start > end) {
      throw new BadRequestError('dateFrom must be earlier than or equal to dateTo');
    }
    return { start, end };
  }

  if (!preset || preset === 'all') {
    return null;
  }

  let start = new Date();
  let end = new Date();
  end.setHours(23, 59, 59, 999);

  switch (preset) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case '7days':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case '30days':
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      break;
    case 'thisMonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;
    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'thisYear':
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    default:
      return null;
  }

  return { start, end };
};

/**
 * 1. Comprehensive Overview Analytics
 */
export const getAnalyticsOverview = async (query = {}) => {
  const boundaries = resolveDateBoundaries(query);
  const dateFilter = boundaries ? { createdAt: { $gte: boundaries.start, $lte: boundaries.end } } : {};

  // Users metrics
  const totalUsers = await User.countDocuments(dateFilter);
  const activeUsers = await User.countDocuments({ ...dateFilter, status: { $ne: false } });
  const customers = await User.countDocuments({ ...dateFilter, role: { $in: ['user', 'Customer', 'customer'] } });

  // Fleet metrics
  const totalCars = await Car.countDocuments(dateFilter);
  const availableCars = await Car.countDocuments({ ...dateFilter, availabilityStatus: { $in: ['available', 'Available'] } });
  const rentedCars = await Car.countDocuments({ ...dateFilter, availabilityStatus: { $in: ['rented', 'Rented'] } });
  const maintenanceCars = await Car.countDocuments({ ...dateFilter, availabilityStatus: { $in: ['maintenance', 'Maintenance'] } });

  // Bookings metrics
  const totalBookings = await Booking.countDocuments(dateFilter);
  const pendingBookings = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['PENDING', 'Pending'] } });
  const confirmedBookings = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['CONFIRMED', 'Confirmed'] } });
  const activeRentals = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['ACTIVE', 'Active'] } });
  const completedRentals = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['COMPLETED', 'Completed'] } });
  const cancelledBookings = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['CANCELLED', 'Cancelled'] } });
  const rejectedBookings = await Booking.countDocuments({ ...dateFilter, bookingStatus: { $in: ['REJECTED', 'Rejected'] } });

  // Booking Values Aggregation
  const bookingValueAgg = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalBookingValue: { $sum: '$totalPrice' },
        avgBookingValue: { $avg: '$totalPrice' },
      },
    },
  ]);
  const totalBookingValue = bookingValueAgg.length > 0 ? bookingValueAgg[0].totalBookingValue : 0;
  const avgBookingValue = bookingValueAgg.length > 0 ? Math.round(bookingValueAgg[0].avgBookingValue) : 0;

  // Payments / COD Ledger Aggregation
  const paymentStatsAgg = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$paymentStatus',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  let collectedCOD = 0;
  let paidCount = 0;
  let pendingCOD = 0;
  let pendingCount = 0;
  let cancelledCOD = 0;
  let cancelledCount = 0;

  paymentStatsAgg.forEach((item) => {
    const statusUpper = (item._id || '').toUpperCase();
    if (statusUpper === 'PAID') {
      collectedCOD += item.totalAmount;
      paidCount += item.count;
    } else if (statusUpper === 'PENDING') {
      pendingCOD += item.totalAmount;
      pendingCount += item.count;
    } else if (statusUpper === 'CANCELLED') {
      cancelledCOD += item.totalAmount;
      cancelledCount += item.count;
    }
  });

  const totalPayments = paidCount + pendingCount + cancelledCount;
  const collectionRate = totalBookingValue > 0 ? Math.round((collectedCOD / totalBookingValue) * 100) : 0;

  // Reviews & Wishlist metrics
  const totalReviews = await Review.countDocuments(dateFilter);
  const reviewScoreAgg = await Review.aggregate([
    { $match: { ...dateFilter, status: 'APPROVED' } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  const averageRating = reviewScoreAgg.length > 0 ? Math.round(reviewScoreAgg[0].avgRating * 10) / 10 : 0;
  const totalWishlistEntries = await Wishlist.countDocuments(dateFilter);

  return {
    dateRange: boundaries ? { start: boundaries.start, end: boundaries.end, preset: query.preset || 'custom' } : { preset: 'all' },
    users: {
      total: totalUsers,
      active: activeUsers,
      customers,
    },
    cars: {
      total: totalCars,
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
      totalBookingValue,
      avgBookingValue,
    },
    payments: {
      total: totalPayments,
      collectedCOD,
      paidCount,
      pendingCOD,
      pendingCount,
      cancelledCOD,
      cancelledCount,
      collectionRate,
    },
    reviews: {
      total: totalReviews,
      averageRating,
    },
    wishlist: {
      total: totalWishlistEntries,
    },
  };
};

/**
 * 2. Monthly Booking Trend Analytics
 */
export const getBookingTrends = async (query = {}) => {
  const targetYear = parseInt(query.year, 10) || new Date().getFullYear();
  const yearStart = new Date(targetYear, 0, 1, 0, 0, 0, 0);
  const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const monthlyAgg = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: yearStart, $lte: yearEnd },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          status: '$bookingStatus',
        },
        count: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' },
      },
    },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    monthIndex: i + 1,
    month: monthNames[i],
    totalBookings: 0,
    completed: 0,
    active: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    bookingValue: 0,
  }));

  monthlyAgg.forEach((item) => {
    const monthIdx = item._id.month - 1;
    if (monthlyData[monthIdx]) {
      const statusUpper = (item._id.status || '').toUpperCase();
      monthlyData[monthIdx].totalBookings += item.count;
      monthlyData[monthIdx].bookingValue += item.totalValue;

      if (statusUpper === 'COMPLETED') monthlyData[monthIdx].completed += item.count;
      else if (statusUpper === 'ACTIVE') monthlyData[monthIdx].active += item.count;
      else if (statusUpper === 'CONFIRMED') monthlyData[monthIdx].confirmed += item.count;
      else if (statusUpper === 'PENDING') monthlyData[monthIdx].pending += item.count;
      else if (statusUpper === 'CANCELLED') monthlyData[monthIdx].cancelled += item.count;
    }
  });

  return {
    year: targetYear,
    labels: monthNames,
    datasets: monthlyData,
  };
};

/**
 * 3. Monthly Revenue / COD Collection Trends
 */
export const getRevenueTrends = async (query = {}) => {
  const targetYear = parseInt(query.year, 10) || new Date().getFullYear();
  const yearStart = new Date(targetYear, 0, 1, 0, 0, 0, 0);
  const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const paymentAgg = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: yearStart, $lte: yearEnd },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          status: '$paymentStatus',
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
    monthIndex: i + 1,
    month: monthNames[i],
    collectedCOD: 0,
    pendingCOD: 0,
    cancelledCOD: 0,
    totalTransactions: 0,
  }));

  paymentAgg.forEach((item) => {
    const monthIdx = item._id.month - 1;
    if (monthlyRevenue[monthIdx]) {
      const statusUpper = (item._id.status || '').toUpperCase();
      monthlyRevenue[monthIdx].totalTransactions += item.count;

      if (statusUpper === 'PAID') {
        monthlyRevenue[monthIdx].collectedCOD += item.totalAmount;
      } else if (statusUpper === 'PENDING') {
        monthlyRevenue[monthIdx].pendingCOD += item.totalAmount;
      } else if (statusUpper === 'CANCELLED') {
        monthlyRevenue[monthIdx].cancelledCOD += item.totalAmount;
      }
    }
  });

  return {
    year: targetYear,
    labels: monthNames,
    datasets: monthlyRevenue,
  };
};

/**
 * 4. Car Fleet Performance Analytics
 */
export const getCarPerformance = async (query = {}) => {
  const boundaries = resolveDateBoundaries(query);
  const dateFilter = boundaries ? { createdAt: { $gte: boundaries.start, $lte: boundaries.end } } : {};
  const limit = parseInt(query.limit, 10) || 10;

  const carAgg = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$car',
        totalBookings: { $sum: 1 },
        completedRentals: {
          $sum: { $cond: [{ $in: [{ $toUpper: '$bookingStatus' }, ['COMPLETED']] }, 1, 0] },
        },
        totalRevenue: {
          $sum: { $cond: [{ $in: [{ $toUpper: '$paymentStatus' }, ['PAID']] }, '$totalPrice', 0] },
        },
        totalBookingValue: { $sum: '$totalPrice' },
        avgDurationDays: { $avg: '$totalDays' },
      },
    },
    { $sort: { totalBookings: -1, totalBookingValue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'cars',
        localField: '_id',
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    { $unwind: '$carDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'carDetails.category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    {
      $project: {
        carId: '$_id',
        carName: '$carDetails.name',
        registrationNumber: '$carDetails.registrationNumber',
        category: { $arrayElemAt: ['$categoryDetails.name', 0] },
        pricePerDay: '$carDetails.pricePerDay',
        rating: '$carDetails.rating',
        totalBookings: 1,
        completedRentals: 1,
        totalRevenue: 1,
        totalBookingValue: 1,
        avgDurationDays: { $round: ['$avgDurationDays', 1] },
      },
    },
  ]);

  return carAgg;
};

/**
 * 5. Category Performance Analytics
 */
export const getCategoryPerformance = async (query = {}) => {
  const boundaries = resolveDateBoundaries(query);
  const dateFilter = boundaries ? { createdAt: { $gte: boundaries.start, $lte: boundaries.end } } : {};

  const categoryAgg = await Booking.aggregate([
    { $match: dateFilter },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'carDoc',
      },
    },
    { $unwind: '$carDoc' },
    {
      $group: {
        _id: '$carDoc.category',
        totalBookings: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' },
        completedCount: {
          $sum: { $cond: [{ $in: [{ $toUpper: '$bookingStatus' }, ['COMPLETED']] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryDoc',
      },
    },
    {
      $project: {
        categoryId: '$_id',
        categoryName: { $ifNull: [{ $arrayElemAt: ['$categoryDoc.name', 0] }, 'Uncategorized'] },
        totalBookings: 1,
        totalValue: 1,
        completedCount: 1,
      },
    },
    { $sort: { totalBookings: -1 } },
  ]);

  return categoryAgg;
};

/**
 * 6. Top Customer Analytics
 */
export const getCustomerAnalytics = async (query = {}) => {
  const boundaries = resolveDateBoundaries(query);
  const dateFilter = boundaries ? { createdAt: { $gte: boundaries.start, $lte: boundaries.end } } : {};
  const limit = parseInt(query.limit, 10) || 10;

  const customerAgg = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$user',
        totalBookings: { $sum: 1 },
        completedRentals: {
          $sum: { $cond: [{ $in: [{ $toUpper: '$bookingStatus' }, ['COMPLETED']] }, 1, 0] },
        },
        totalSpent: {
          $sum: { $cond: [{ $in: [{ $toUpper: '$paymentStatus' }, ['PAID']] }, '$totalPrice', 0] },
        },
        totalBookingValue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { totalBookingValue: -1, totalBookings: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDoc',
      },
    },
    { $unwind: '$userDoc' },
    {
      $project: {
        userId: '$_id',
        name: '$userDoc.name',
        email: '$userDoc.email',
        phone: '$userDoc.phone',
        totalBookings: 1,
        completedRentals: 1,
        totalSpent: 1,
        totalBookingValue: 1,
      },
    },
  ]);

  return customerAgg;
};

/**
 * 7. Generate Data Tables and CSV Reports
 */
export const generateReport = async (reportType, query = {}) => {
  const boundaries = resolveDateBoundaries(query);
  const dateFilter = boundaries ? { createdAt: { $gte: boundaries.start, $lte: boundaries.end } } : {};

  let data = [];
  let headers = [];

  if (reportType === 'bookings') {
    const bookings = await Booking.find(dateFilter)
      .populate('car', 'name registrationNumber pricePerDay')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    headers = ['Booking ID', 'Customer Name', 'Customer Email', 'Car Name', 'Reg Number', 'Pickup Date', 'Dropoff Date', 'Days', 'Amount', 'Booking Status', 'Payment Status', 'Created At'];
    data = bookings.map((b) => [
      b._id.toString(),
      b.user?.name || 'N/A',
      b.user?.email || 'N/A',
      b.car?.name || 'N/A',
      b.car?.registrationNumber || 'N/A',
      new Date(b.pickupDate).toISOString().slice(0, 10),
      new Date(b.dropoffDate).toISOString().slice(0, 10),
      b.totalDays,
      b.totalPrice,
      b.bookingStatus,
      b.paymentStatus,
      new Date(b.createdAt).toISOString(),
    ]);
  } else if (reportType === 'payments') {
    const payments = await Payment.find(dateFilter)
      .populate('user', 'name email phone')
      .populate({ path: 'booking', populate: { path: 'car', select: 'name' } })
      .populate('collectedBy', 'name')
      .sort({ createdAt: -1 });

    headers = ['Receipt Number', 'Customer Name', 'Customer Email', 'Car', 'Amount (INR)', 'Payment Method', 'Payment Status', 'Collected By', 'Collected At', 'Created At'];
    data = payments.map((p) => [
      p.receiptNumber || 'PENDING',
      p.user?.name || 'N/A',
      p.user?.email || 'N/A',
      p.booking?.car?.name || 'N/A',
      p.amount,
      p.paymentMethod,
      p.paymentStatus,
      p.collectedBy?.name || 'N/A',
      p.collectedAt ? new Date(p.collectedAt).toISOString() : 'N/A',
      new Date(p.createdAt).toISOString(),
    ]);
  } else if (reportType === 'cars') {
    const carStats = await getCarPerformance(query);
    headers = ['Car Name', 'Registration Number', 'Category', 'Daily Rate', 'Rating', 'Total Bookings', 'Completed Rentals', 'Total Revenue (INR)', 'Avg Duration (Days)'];
    data = carStats.map((c) => [
      c.carName,
      c.registrationNumber || 'N/A',
      c.category || 'N/A',
      c.pricePerDay,
      c.rating || 0,
      c.totalBookings,
      c.completedRentals,
      c.totalRevenue,
      c.avgDurationDays,
    ]);
  } else if (reportType === 'customers') {
    const custStats = await getCustomerAnalytics(query);
    headers = ['Customer Name', 'Email', 'Phone', 'Total Bookings', 'Completed Rentals', 'Total Spent (INR)', 'Total Booking Value (INR)'];
    data = custStats.map((c) => [
      c.name,
      c.email,
      c.phone || 'N/A',
      c.totalBookings,
      c.completedRentals,
      c.totalSpent,
      c.totalBookingValue,
    ]);
  }

  // Format as CSV if requested
  if (query.format === 'csv') {
    const csvRows = [];
    csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));
    data.forEach((row) => {
      csvRows.push(row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','));
    });
    return { isCsv: true, csvString: csvRows.join('\n'), filename: `${reportType}-report-${Date.now()}.csv` };
  }

  return {
    isCsv: false,
    headers,
    records: data.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    }),
  };
};

export default {
  resolveDateBoundaries,
  getAnalyticsOverview,
  getBookingTrends,
  getRevenueTrends,
  getCarPerformance,
  getCategoryPerformance,
  getCustomerAnalytics,
  generateReport,
};
