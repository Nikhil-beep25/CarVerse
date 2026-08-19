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

// Mount module routers (with plural & singular aliases for compatibility)
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', analyticsRoutes);

router.use('/auth', authRoutes);

router.use('/brands', brandRoutes);
router.use('/brand', brandRoutes);

router.use('/cars', carRoutes);
router.use('/car', carRoutes);

router.use('/categories', categoryRoutes);
router.use('/category', categoryRoutes);

router.use('/bookings', bookingRoutes);
router.use('/booking', bookingRoutes);

router.use('/payments', paymentRoutes);
router.use('/payment', paymentRoutes);

router.use('/reviews', reviewRoutes);
router.use('/review', reviewRoutes);

router.use('/wishlists', wishlistRoutes);
router.use('/wishlist', wishlistRoutes);

router.use('/faqs', faqRoutes);
router.use('/faq', faqRoutes);

router.use('/features', featureRoutes);
router.use('/feature', featureRoutes);

router.use('/services', serviceRoutes);
router.use('/service', serviceRoutes);

router.use('/settings', settingRoutes);
router.use('/setting', settingRoutes);

export default router;
