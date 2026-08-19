import app from './app.js';
import { env } from './src/config/env.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { createDefaultAdmin } from './src/utils/createDefaultAdmin.js';
import { logger } from './src/utils/logger.js';

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`[UNCAUGHT EXCEPTION] Shutting down... ${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Connect to Database and start server
const startServer = async () => {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Provision initial super admin account safely
    await createDefaultAdmin();

    // 3. Start HTTP server listener
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in [${env.NODE_ENV}] mode on port [${env.PORT}]`);
      logger.info(`Gateway active at http://localhost:${env.PORT}/api/v1/health`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`[UNHANDLED REJECTION] ${err.name}: ${err.message}`);
      logger.error(err.stack);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    // Handle Graceful Termination Signals (SIGTERM, SIGINT)
    const shutdown = (signal) => {
      logger.info(`[${signal}] received. Closing HTTP server and database connections gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('HTTP server and database connections closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
