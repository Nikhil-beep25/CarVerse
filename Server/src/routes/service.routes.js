import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validations/service.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(serviceController.getServices)
  .post(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(createServiceSchema), serviceController.createService);

router
  .route('/:id')
  .get(serviceController.getService)
  .put(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(updateServiceSchema), serviceController.updateService)
  .delete(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), serviceController.deleteService);

export default router;
