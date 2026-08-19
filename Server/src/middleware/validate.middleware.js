import { ValidationError } from '../errors/index.js';

/**
 * Validates request data (body, query, params) against a Zod schema.
 * Supports both wrapped schemas ({ body: ... }) and direct body schemas.
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Check if schema is wrapped with body / params / query or direct
    const schemaShape = schema.shape || {};
    const hasHttpKeys = 'body' in schemaShape || 'query' in schemaShape || 'params' in schemaShape;

    if (hasHttpKeys) {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.query !== undefined) {
        try {
          req.query = parsed.query;
        } catch (_) {
          if (req.query && typeof req.query === 'object') {
            Object.assign(req.query, parsed.query);
          }
        }
      }
      if (parsed.params !== undefined) {
        try {
          req.params = parsed.params;
        } catch (_) {
          if (req.params && typeof req.params === 'object') {
            Object.assign(req.params, parsed.params);
          }
        }
      }
    } else {
      // Direct body validation
      const parsed = schema.parse(req.body);
      req.body = parsed;
    }

    next();
  } catch (error) {
    const rawIssues = error.issues || error.errors;
    if (rawIssues && Array.isArray(rawIssues)) {
      const formattedErrors = rawIssues.map((err) => ({
        field: (err.path && err.path.length > 1 && (err.path[0] === 'body' || err.path[0] === 'query' || err.path[0] === 'params')
          ? err.path.slice(1)
          : err.path || []
        ).join('.'),
        message: err.message,
      }));
      return next(new ValidationError('Request validation failed on submitted fields', formattedErrors));
    }
    next(error);
  }
};

export default { validate };
