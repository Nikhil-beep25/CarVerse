import { AppError } from './AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', errors = null) {
    super(message, HTTP_STATUS.UNAUTHORIZED, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', errors = null) {
    super(message, HTTP_STATUS.FORBIDDEN, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found', errors = null) {
    super(message, HTTP_STATUS.NOT_FOUND, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict / Resource Already Exists', errors = null) {
    super(message, HTTP_STATUS.CONFLICT, errors);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', errors = null) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', errors = null) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errors);
  }
}

export { AppError };
