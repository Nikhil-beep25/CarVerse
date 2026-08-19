import express from 'express';
import * as featureController from '../controllers/feature.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createFeatureSchema, updateFeatureSchema } from '../validations/feature.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(featureController.getFeatures)
  .post(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(createFeatureSchema), featureController.createFeature);

router
  .route('/:id')
  .get(featureController.getFeature)
  .put(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(updateFeatureSchema), featureController.updateFeature)
  .delete(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), featureController.deleteFeature);

export default router;
