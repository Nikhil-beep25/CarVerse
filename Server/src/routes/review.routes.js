import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
  carIdParamSchema,
} from '../validations/review.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

// Public: Get Car Reviews & Summary
router.get(
  '/car/:carId',
  validate(carIdParamSchema),
  reviewController.getCarReviews
);

// Protected Customer: View My Reviews
router.get('/my-reviews', protect, reviewController.getMyReviews);

// Protected Customer: Submit Review
router.post(
  '/',
  protect,
  validate(createReviewSchema),
  reviewController.createReview
);

// Admin: List & Filter All Reviews
router.get(
  '/admin/all',
  protect,
  authorize(...ADMIN_ROLES),
  reviewController.getAllReviewsAdmin
);

// Protected: Get Single Review
router.get(
  '/:id',
  validate(reviewIdParamSchema),
  reviewController.getReview
);

// Protected Customer: Edit Own Review
router.put(
  '/:id',
  protect,
  validate(updateReviewSchema),
  reviewController.updateReview
);

// Protected Customer/Admin: Delete Review
router.delete(
  '/:id',
  protect,
  validate(reviewIdParamSchema),
  reviewController.deleteReview
);

export default router;
