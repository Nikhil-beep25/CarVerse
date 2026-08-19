import Feature from '../models/Feature.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

export const getAllFeatures = async (query = {}) => {
  const filter = {};
  if (query.status !== undefined) {
    filter.status = query.status === 'true' || query.status === true;
  }
  return await Feature.find(filter).sort({ createdAt: 1 });
};

export const getFeatureById = async (id) => {
  const feature = mongoose.isValidObjectId(id)
    ? await Feature.findById(id)
    : await Feature.findOne({ _id: id });
  if (!feature) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Feature'));
  }
  return feature;
};

export const createFeature = async (data) => {
  const existing = await Feature.findOne({ name: new RegExp(`^${data.name.trim()}$`, 'i') });
  if (existing) {
    throw new BadRequestError('Feature with this name already exists');
  }
  return await Feature.create(data);
};

export const updateFeature = async (id, data) => {
  const feature = await Feature.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!feature) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Feature'));
  }
  return feature;
};

export const deleteFeature = async (id) => {
  const feature = await Feature.findByIdAndDelete(id);
  if (!feature) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Feature'));
  }
  return feature;
};

export default {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
};
