import Service from '../models/Service.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

export const getAllServices = async (query = {}) => {
  const filter = {};
  if (query.status !== undefined) {
    filter.status = query.status === 'true' || query.status === true;
  }
  return await Service.find(filter).sort({ createdAt: 1 });
};

export const getServiceById = async (id) => {
  const service = mongoose.isValidObjectId(id)
    ? await Service.findById(id)
    : await Service.findOne({ _id: id });
  if (!service) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Service'));
  }
  return service;
};

export const createService = async (data) => {
  const existing = await Service.findOne({ name: new RegExp(`^${data.name.trim()}$`, 'i') });
  if (existing) {
    throw new BadRequestError('Service with this name already exists');
  }
  return await Service.create(data);
};

export const updateService = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!service) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Service'));
  }
  return service;
};

export const deleteService = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Service'));
  }
  return service;
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
