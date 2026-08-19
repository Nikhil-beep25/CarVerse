import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// 1. Authentication Lifecycle
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.route('/logout').get(authController.logout).post(authController.logout);

// 2. Profile Management
router.get('/me', protect, authController.getMe);
router
  .route('/profile')
  .get(protect, authController.getMe)
  .put(protect, validate(updateProfileSchema), authController.updateProfile);
router.put('/updateprofile', protect, validate(updateProfileSchema), authController.updateProfile);

// 3. Password Security & Recovery
router.put(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  authController.changePassword
);
router.put(
  '/changepassword',
  protect,
  validate(changePasswordSchema),
  authController.changePassword
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/forgotpassword',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);
router.post(
  '/resetpassword',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);
router.route('/reset-password/:token').post(authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.route('/resetpassword/:resetToken').put(authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);

export default router;
