import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import { logger } from './logger.js';

export const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@carverse.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        username: 'admin',
        email: 'admin@carverse.com',
        password: 'Admin@123',
        role: ROLES.ADMIN,
      });
      logger.info('Default Admin Created Successfully [Email: admin@carverse.com]');
    } else {
      logger.debug('Default Admin already verified in database');
    }
  } catch (error) {
    logger.error(`Error initializing default admin: ${error.message}`);
  }
};

export default createDefaultAdmin;
