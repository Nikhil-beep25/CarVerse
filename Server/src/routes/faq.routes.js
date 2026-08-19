import express from 'express';
import * as faqController from '../controllers/faq.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createFaqSchema, updateFaqSchema } from '../validations/faq.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(faqController.getFaqs)
  .post(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(createFaqSchema), faqController.createFaq);

router
  .route('/:id')
  .get(faqController.getFaq)
  .put(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(updateFaqSchema), faqController.updateFaq)
  .delete(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), faqController.deleteFaq);

export default router;
