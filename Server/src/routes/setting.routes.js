import express from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createSettingSchema, updateSettingSchema } from '../validations/setting.validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(settingController.getSettings)
  .post(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(createSettingSchema), settingController.createSetting)
  .put(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(updateSettingSchema), settingController.updateSetting);

router
  .route('/:id')
  .get(settingController.getSettings)
  .put(protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validate(updateSettingSchema), settingController.updateSetting);

export default router;
