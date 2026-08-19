import Faq from '../models/Faq.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

export const getAllFaqs = async (query = {}) => {
  const filter = {};
  if (query.status !== undefined) {
    filter.status = query.status === 'true' || query.status === true;
  }
  return await Faq.find(filter).sort({ createdAt: 1 });
};

export const getFaqById = async (id) => {
  const faq = mongoose.isValidObjectId(id)
    ? await Faq.findById(id)
    : await Faq.findOne({ _id: id });
  if (!faq) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('FAQ'));
  }
  return faq;
};

export const createFaq = async (data) => {
  const existing = await Faq.findOne({ question: new RegExp(`^${data.question.trim()}$`, 'i') });
  if (existing) {
    throw new BadRequestError('FAQ with this question already exists');
  }
  return await Faq.create(data);
};

export const updateFaq = async (id, data) => {
  const faq = await Faq.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!faq) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('FAQ'));
  }
  return faq;
};

export const deleteFaq = async (id) => {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('FAQ'));
  }
  return faq;
};

export default {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
