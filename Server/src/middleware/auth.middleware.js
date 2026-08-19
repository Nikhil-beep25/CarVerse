import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { verifyToken } from '../helpers/token.helper.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract from Bearer Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Extract from cookie fallback
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthorizedError(RESPONSE_MESSAGES.UNAUTHORIZED);
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_TOKEN);
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // Account suspension / deactivation check
    if (user.status === false || user.accountStatus === 'inactive' || user.accountStatus === 'suspended') {
      throw new ForbiddenError('Your account has been deactivated or suspended. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(RESPONSE_MESSAGES.TOKEN_EXPIRED);
    }
    // Handle JsonWebTokenError, SyntaxError, or any malformed decoding error as 401 Invalid Token
    throw new UnauthorizedError(RESPONSE_MESSAGES.INVALID_TOKEN);
  }
});

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles - Permitted user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError(RESPONSE_MESSAGES.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `User role '${req.user.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};

export default { protect, authorize };
