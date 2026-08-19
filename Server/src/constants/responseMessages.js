export const RESPONSE_MESSAGES = Object.freeze({
  // Auth
  AUTH_SUCCESS: 'Authentication successful',
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGOUT_SUCCESS: 'User logged out successfully',
  UNAUTHORIZED: 'Not authorized to access this route',
  FORBIDDEN: 'Access denied: insufficient permissions',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Token has expired, please log in again',
  INVALID_TOKEN: 'Invalid authentication token',

  // Common CRUD
  CREATED: (resource) => `${resource} created successfully`,
  FETCHED: (resource) => `${resource} fetched successfully`,
  FETCHED_SINGLE: (resource) => `${resource} fetched successfully`,
  FETCHED_ALL: (resource) => `All ${resource} fetched successfully`,
  UPDATED: (resource) => `${resource} updated successfully`,
  DELETED: (resource) => `${resource} deleted successfully`,
  NOT_FOUND: (resource) => `${resource} not found`,
  ALREADY_EXISTS: (resource) => `${resource} with this name already exists`,

  // Server & Validation
  VALIDATION_ERROR: 'Validation failed on submitted data',
  INTERNAL_SERVER_ERROR: 'An unexpected internal server error occurred',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later',
});
