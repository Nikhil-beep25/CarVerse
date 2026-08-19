import multer from 'multer';
import { AppError } from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl} - Resource Route Not Found`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected internal error occurred';
  let errors = err.errors || null;

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid format for identifier: '${err.value}'`;
  }

  // 2. Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value '${value}' entered for unique field '${field}'. Please use another value.`;
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    message = 'Validation failed for one or more fields';
  }

  // 4. Zod Validation Error
  if (err.name === 'ZodError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    const issues = err.issues || err.errors || [];
    errors = issues.map((i) => ({
      field: (i.path && i.path.length > 1 ? i.path.slice(1) : i.path || []).join('.'),
      message: i.message,
    }));
    message = 'Request validation failed on submitted fields';
  }

  // 5. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Authentication token has expired. Please log in again.';
  }

  // 6. Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum allowed size (5MB)';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field: ${err.field}`;
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Log error for developer observability
  if (statusCode >= 500) {
    logger.error(`[500 ERROR] ${req.method} ${req.originalUrl}:`, err);
  } else {
    logger.debug(`[CLIENT ERROR ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  // Construct standardized error response
  const response = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }

  // Include stack trace only in non-production environments
  if (env.isDevelopment) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export default { notFoundHandler, errorHandler };
