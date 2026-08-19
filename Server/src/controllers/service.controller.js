import * as serviceService from '../services/service.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServices(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('Services'), services);
});

export const getService = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Service'), service);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Service'), service);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Service'), service);
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await serviceService.deleteService(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Service'), service);
});

export default {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
