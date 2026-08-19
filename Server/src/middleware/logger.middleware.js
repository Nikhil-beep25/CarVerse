import morgan from 'morgan';
import { env } from '../config/env.js';

export const httpLogger = morgan(
  env.isDevelopment ? 'dev' : 'combined'
);
