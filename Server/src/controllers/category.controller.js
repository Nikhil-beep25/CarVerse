import * as categoryService from '../services/category.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('categories'), categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED('Category'), category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Category'), category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Category'), category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Category'), {});
});
