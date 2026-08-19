import Category from '../models/Category.js';
import Car from '../models/Car.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

export const getAllCategories = async (query = {}) => {
  const filter = {};
  if (query.status !== undefined) {
    filter.status = query.status === 'true' || query.status === true;
  }
  return await Category.find(filter).sort({ name: 1 });
};

export const getCategoryById = async (id) => {
  const category = mongoose.isValidObjectId(id)
    ? await Category.findById(id)
    : await Category.findOne({ _id: id });
  if (!category) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Category'));
  }
  return category;
};

export const createCategory = async (data) => {
  const existing = await Category.findOne({ name: new RegExp(`^${data.name.trim()}$`, 'i') });
  if (existing) {
    throw new BadRequestError(`Category with name '${data.name}' already exists`);
  }
  return await Category.create(data);
};

export const updateCategory = async (id, data) => {
  if (data.name) {
    const existing = await Category.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${data.name.trim()}$`, 'i'),
    });
    if (existing) {
      throw new BadRequestError(`Another category with name '${data.name}' already exists`);
    }
  }

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Category'));
  }
  return category;
};

export const deleteCategory = async (id) => {
  const carCount = await Car.countDocuments({ category: id });
  if (carCount > 0) {
    throw new BadRequestError(`Cannot delete category because ${carCount} active car(s) are linked to it.`);
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Category'));
  }
  return category;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
