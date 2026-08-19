import * as brandService from '../services/brand.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.getAllBrands();
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('brands'), brands);
});

export const getBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED('Brand'), brand);
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Brand'), brand);
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.updateBrand(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Brand'), brand);
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.deleteBrand(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Brand'), {});
});
