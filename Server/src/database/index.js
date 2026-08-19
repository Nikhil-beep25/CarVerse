import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * MongoDB connection options for optimal pooling, reliability, and resilience.
 */
const mongooseOptions = {
  autoIndex: !env.isProduction, // Disable auto-indexing in production for performance
  maxPoolSize: 10,             // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,     // Close sockets after 45 seconds of inactivity
};

/**
 * Connect to MongoDB database instance
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async () => {
  try {
    if (!env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please provide a valid MongoDB connection string.');
    }
    const isAtlas = (env.MONGODB_URI || '').includes('mongodb.net') || (env.MONGODB_URI || '').startsWith('mongodb+srv');
    const safeUriLog = isAtlas
      ? 'MongoDB Atlas URI Loaded'
      : (env.MONGODB_URI && !env.MONGODB_URI.includes('localhost') ? 'Custom Remote URI Loaded' : 'Local MongoDB URI Loaded');
    
    logger.info(`[MongoDB] Configuration: ${safeUriLog}`);

    const conn = await mongoose.connect(env.MONGODB_URI, mongooseOptions);

    logger.info(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Register connection lifecycle event listeners
    mongoose.connection.on('error', (err) => {
      logger.error(`[MongoDB] Runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('[MongoDB] Connection disconnected. Attempting auto-reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('[MongoDB] Connection successfully re-established');
    });

    return conn;
  } catch (error) {
    logger.error(`[MongoDB] Initial connection failed: ${error.message}`);
    throw error;
  }
};

/**
 * Gracefully disconnect from MongoDB database instance
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close(false);
    logger.info('[MongoDB] Connection closed gracefully');
  } catch (error) {
    logger.error(`[MongoDB] Error during disconnect: ${error.message}`);
  }
};

export default { connectDB, disconnectDB };
