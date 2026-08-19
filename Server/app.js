import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { corsOptions } from './src/config/cors.js';
import { httpLogger } from './src/middleware/logger.middleware.js';
import { globalRateLimiter } from './src/middleware/rateLimiter.middleware.js';
import { notFoundHandler, errorHandler } from './src/middleware/error.middleware.js';
import apiRouter from './src/routes/index.js';
import { ApiResponse } from './src/utils/ApiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin image loading
  })
);

// 2. CORS Handling
app.use(cors(corsOptions));

// 3. Response Compression
app.use(compression());

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. HTTP Request Logging
app.use(httpLogger);

// 7. Static Assets Serving (Public directory & Local uploads)
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/uploads', express.static(path.resolve(__dirname, 'src/uploads')));

// 8. Global API Rate Limiter
app.use('/api', globalRateLimiter);

// 9. Dedicated Production Health Check Endpoints
app.get(['/api/v1/health', '/api/health', '/health'], (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'CarVerse API is running',
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 10. Root Gateway Status Endpoint
app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'CarVerse API is running',
    environment: process.env.NODE_ENV || 'production',
    documentation: '/api/v1/health',
  });
});

// 11. Versioned API Routes (/api/v1) & Backward-Compatible Route Alias (/api)
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Ensures existing client calls continue working seamlessly

// 11. 404 Route Not Found Handler
app.use(notFoundHandler);

// 12. Centralized Global Error Handler
app.use(errorHandler);

export default app;
