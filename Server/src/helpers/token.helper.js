import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (payload, expiresIn = env.JWT_EXPIRE) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const getCookieOptions = () => {
  return {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
  };
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken({ id: user._id, role: user.role });
  const options = getCookieOptions();

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
    },
    // Also include user at root for backward compatibility with AuthSlice
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
    },
  });
};
