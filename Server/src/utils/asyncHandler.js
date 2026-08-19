/**
 * Higher-order function to wrap asynchronous express route handlers and eliminate try-catch boilerplate.
 * Any unhandled exception is forwarded to next() and caught by the global error middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
