import * as featureService from '../services/feature.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getFeatures = asyncHandler(async (req, res) => {
  const features = await featureService.getAllFeatures(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('Features'), features);
});

export const getFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.getFeatureById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Feature'), feature);
});

export const createFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.createFeature(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Feature'), feature);
});

export const updateFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.updateFeature(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Feature'), feature);
});

export const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await featureService.deleteFeature(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Feature'), feature);
});

export default {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
};
