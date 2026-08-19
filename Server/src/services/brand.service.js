import Brand from '../models/Brand.js';
import Car from '../models/Car.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

export const getAllBrands = async (query = {}) => {
  const filter = {};
  if (query.status !== undefined) {
    filter.status = query.status === 'true' || query.status === true;
  }
  return await Brand.find(filter).sort({ name: 1 });
};

export const getBrandById = async (id) => {
  const brand = mongoose.isValidObjectId(id)
    ? await Brand.findById(id)
    : await Brand.findOne({ _id: id });
  if (!brand) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Brand'));
  }
  return brand;
};

export const createBrand = async (data) => {
  const existing = await Brand.findOne({ name: new RegExp(`^${data.name.trim()}$`, 'i') });
  if (existing) {
    throw new BadRequestError(`Brand with name '${data.name}' already exists`);
  }
  return await Brand.create(data);
};

export const updateBrand = async (id, data) => {
  if (data.name) {
    const existing = await Brand.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${data.name.trim()}$`, 'i'),
    });
    if (existing) {
      throw new BadRequestError(`Another brand with name '${data.name}' already exists`);
    }
  }

  const brand = await Brand.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!brand) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Brand'));
  }
  return brand;
};

export const deleteBrand = async (id) => {
  // Check if any car uses this brand
  const carCount = await Car.countDocuments({ brand: id });
  if (carCount > 0) {
    throw new BadRequestError(`Cannot delete brand because ${carCount} active car(s) are linked to it.`);
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Brand'));
  }
  return brand;
};

export default {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
