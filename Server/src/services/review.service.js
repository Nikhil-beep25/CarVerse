import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import mongoose from 'mongoose';

/**
 * Create a new Review for a completed booking
 */
export const createReview = async (userId, payload) => {
  const { carId, bookingId, rating, title, comment } = payload;

  // 1. Verify Car
  const car = await Car.findById(carId);
  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Vehicle'));
  }

  // 2. Verify Booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Booking'));
  }

  // 3. Verify Booking Ownership (IDOR prevention)
  if (booking.user.toString() !== userId.toString()) {
    throw new ForbiddenError('You can only submit reviews for your own bookings.');
  }

  // 4. Verify Booking matches Car
  if (booking.car.toString() !== carId.toString()) {
    throw new BadRequestError('This booking does not correspond to the specified vehicle.');
  }

  // 5. Verify Booking is COMPLETED
  const normalizedStatus = (booking.bookingStatus || '').toUpperCase();
  if (normalizedStatus !== 'COMPLETED') {
    throw new BadRequestError(
      `Reviews can only be submitted for COMPLETED rentals. Current booking status is '${booking.bookingStatus}'.`
    );
  }

  // 6. Verify No Duplicate Review for this booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    throw new ConflictError('A review has already been submitted for this completed booking.');
  }

  // 7. Create Review record
  const review = await Review.create({
    user: userId,
    car: carId,
    booking: bookingId,
    rating,
    title: title || '',
    comment,
    status: 'APPROVED',
  });

  // Explicitly recalculate and update car rating
  await Review.calculateAverageRating(carId);

  return await Review.findById(review._id)
    .populate('user', 'name avatar')
    .populate('car', 'name pic');
};

/**
 * Get Public Reviews & Aggregation breakdown for a Car
 */
export const getCarReviews = async (carId, queryParams = {}) => {
  if (!mongoose.isValidObjectId(carId)) {
    throw new BadRequestError('Invalid vehicle ID format');
  }

  const matchFilter = {
    car: new mongoose.Types.ObjectId(carId),
    status: 'APPROVED',
  };

  // 1. Compute Aggregations
  const distributionAgg = await Review.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;
  let totalReviews = 0;

  distributionAgg.forEach((item) => {
    if (ratingCounts[item._id] !== undefined) {
      ratingCounts[item._id] = item.count;
      totalRatingSum += item._id * item.count;
      totalReviews += item.count;
    }
  });

  const averageRating = totalReviews > 0 ? Math.round((totalRatingSum / totalReviews) * 10) / 10 : 0;

  const distribution = {
    5: { count: ratingCounts[5], percentage: totalReviews > 0 ? Math.round((ratingCounts[5] / totalReviews) * 100) : 0 },
    4: { count: ratingCounts[4], percentage: totalReviews > 0 ? Math.round((ratingCounts[4] / totalReviews) * 100) : 0 },
    3: { count: ratingCounts[3], percentage: totalReviews > 0 ? Math.round((ratingCounts[3] / totalReviews) * 100) : 0 },
    2: { count: ratingCounts[2], percentage: totalReviews > 0 ? Math.round((ratingCounts[2] / totalReviews) * 100) : 0 },
    1: { count: ratingCounts[1], percentage: totalReviews > 0 ? Math.round((ratingCounts[1] / totalReviews) * 100) : 0 },
  };

  // 2. Sorting options
  let sortOption = { createdAt: -1 };
  if (queryParams.sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
  if (queryParams.sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
  if (queryParams.sort === 'oldest') sortOption = { createdAt: 1 };

  // 3. Pagination
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const reviews = await Review.find(matchFilter)
    .populate('user', 'name avatar')
    .sort(sortOption)
    .skip(startIndex)
    .limit(limit);

  const pagination = {
    total: totalReviews,
    page,
    limit,
    pages: Math.ceil(totalReviews / limit) || 1,
    totalPages: Math.ceil(totalReviews / limit) || 1,
    totalItems: totalReviews,
  };

  return {
    summary: {
      averageRating,
      totalReviews,
      distribution,
    },
    reviews,
    pagination,
  };
};

/**
 * Get Customer's Personal Reviews
 */
export const getMyReviews = async (userId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Review.countDocuments({ user: userId });
  const reviews = await Review.find({ user: userId })
    .populate('car', 'name pic rating pricePerDay')
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

  return { reviews, pagination };
};

/**
 * Get Review by ID
 */
export const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate('user', 'name email avatar')
    .populate('car', 'name pic');

  if (!review) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Review'));
  }

  return review;
};

/**
 * Update Customer's Own Review
 */
export const updateReview = async (id, userId, updateData) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Review'));
  }

  // IDOR check: Only the author can update their review
  if (review.user.toString() !== userId.toString()) {
    throw new ForbiddenError('You can only update your own reviews.');
  }

  if (updateData.rating !== undefined) review.rating = updateData.rating;
  if (updateData.title !== undefined) review.title = updateData.title;
  if (updateData.comment !== undefined) review.comment = updateData.comment;

  await review.save();

  // Explicitly recalculate car rating
  await Review.calculateAverageRating(review.car);

  return await Review.findById(id).populate('user', 'name avatar').populate('car', 'name pic');
};

/**
 * Delete Review (Customer Owner or Admin)
 */
export const deleteReview = async (id, requestingUser) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Review'));
  }

  const isAdmin = ADMIN_ROLES.includes(requestingUser.role);
  const isOwner = review.user.toString() === requestingUser._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError('You are not authorized to delete this review.');
  }

  const carId = review.car;
  await Review.findByIdAndDelete(id);

  // Recalculate car average rating
  await Review.calculateAverageRating(carId);

  return review;
};

/**
 * Admin Get All Reviews with filtering and pagination
 */
export const getAllReviewsAdmin = async (queryParams = {}) => {
  const filterCriteria = {};

  if (queryParams.car && mongoose.isValidObjectId(queryParams.car)) {
    filterCriteria.car = queryParams.car;
  }

  if (queryParams.rating) {
    filterCriteria.rating = Number(queryParams.rating);
  }

  if (queryParams.status) {
    filterCriteria.status = queryParams.status.toUpperCase();
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Review.countDocuments(filterCriteria);
  const reviews = await Review.find(filterCriteria)
    .populate('user', 'name email phone')
    .populate('car', 'name pic registrationNumber')
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

  return { reviews, pagination };
};

export default {
  createReview,
  getCarReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
};
