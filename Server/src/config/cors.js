import { env } from './env.js';

const defaultAllowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, mobile apps, or health checkers with no origin header
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured whitelist or localhost during development
    const isAllowed =
      defaultAllowedOrigins.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com');

    if (isAllowed || env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(null, true); // Allow cross-origin read safely or return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours preflight cache
};
