import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Standardized API Response Envelope
 */
export class ApiResponse {
  constructor(data, message = 'Success', pagination = null) {
    this.success = true;
    this.message = message;
    if (data !== undefined && data !== null) {
      this.data = data;
    }
    if (pagination) {
      this.pagination = pagination;
    }
  }

  /**
   * Send 200 OK standard response
   */
  static success(res, message = 'Success', data = null, statusCode = HTTP_STATUS.OK, pagination = null) {
    const response = new ApiResponse(data, message, pagination);
    return res.status(statusCode).json(response);
  }

  /**
   * Send 201 Created standard response
   */
  static created(res, message = 'Resource created successfully', data = null) {
    const response = new ApiResponse(data, message);
    return res.status(HTTP_STATUS.CREATED).json(response);
  }

  /**
   * Send 204 No Content response
   */
  static noContent(res) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default ApiResponse;
