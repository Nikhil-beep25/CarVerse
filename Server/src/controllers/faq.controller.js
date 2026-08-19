import * as faqService from '../services/faq.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await faqService.getAllFaqs(req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('FAQs'), faqs);
});

export const getFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.getFaqById(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_SINGLE('FAQ'), faq);
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.createFaq(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('FAQ'), faq);
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('FAQ'), faq);
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.deleteFaq(req.params.id);
  return ApiResponse.success(res, RESPONSE_MESSAGES.DELETED('FAQ'), faq);
});

export default {
  getFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
};
