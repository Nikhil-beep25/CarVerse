import * as carService from '../services/car.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getCars = asyncHandler(async (req, res) => {
  const { cars, pagination } = await carService.getAllCars(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('cars'), cars, 200, pagination);
});

export const getCar = asyncHandler(async (req, res) => {
  const car = await carService.getCarById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('Car'), car);
});

export const createCar = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // If uploaded files exist in req.files
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadedPaths = req.files.map((file) => `car/${file.filename}`);
    payload.pic = uploadedPaths;
    payload.images = uploadedPaths;
  }

  const car = await carService.createCar(payload);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Car'), car);
});

export const updateCar = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadedPaths = req.files.map((file) => `car/${file.filename}`);
    payload.pic = uploadedPaths;
    payload.images = uploadedPaths;
  }

  const car = await carService.updateCar(req.params.id, payload);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Car'), car);
});

export const deleteCar = asyncHandler(async (req, res) => {
  const car = await carService.deleteCar(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('Car'), car);
});

export default {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
};
