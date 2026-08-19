import express from 'express';
import authRoutes from './auth.routes.js';
import brandRoutes from './brand.routes.js';
import carRoutes from './car.routes.js';
import categoryRoutes from './category.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import reviewRoutes from './review.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import adminRoutes from './admin.routes.js';
import analyticsRoutes from './analytics.routes.js';
import faqRoutes from './faq.routes.js';
import featureRoutes from './feature.routes.js';
import serviceRoutes from './service.routes.js';
import settingRoutes from './setting.routes.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'CarVerse API is running',
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount module routers
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/cars', carRoutes);
router.use('/categories', categoryRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/faqs', faqRoutes);
router.use('/features', featureRoutes);
router.use('/services', serviceRoutes);
router.use('/settings', settingRoutes);

console.log('Car routes mounted successfully at /api/v1/cars');

export default router;
