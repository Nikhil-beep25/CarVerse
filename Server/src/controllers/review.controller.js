import * as reviewService from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  return ApiResponse.created(res, 'Review submitted successfully', review);
});

export const getCarReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getCarReviews(req.params.carId, req.query);
  return ApiResponse.success(res, 'Car reviews retrieved successfully', result.reviews, 200, {
    ...result.pagination,
    summary: result.summary,
  });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const { reviews, pagination } = await reviewService.getMyReviews(req.user._id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('user reviews'), reviews, 200, pagination);
});

export const getReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Review'), review);
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Review'), review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await reviewService.deleteReview(req.params.id, req.user);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Review'), review);
});

export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const { reviews, pagination } = await reviewService.getAllReviewsAdmin(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('reviews'), reviews, 200, pagination);
});

export default {
  createReview,
  getCarReviews,
  getMyReviews,
  getReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
};
