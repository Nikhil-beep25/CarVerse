import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

// Global API rate limiter: 1000 requests per 15 minutes per IP (5000 in dev)
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? 5000 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: RESPONSE_MESSAGES.TOO_MANY_REQUESTS,
  },
});

// Strict rate limiter for authentication routes (login, register): 20 requests per 15 minutes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});
