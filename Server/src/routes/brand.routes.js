import express from 'express';
import * as brandController from '../controllers/brand.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { optionalUpload, uploadSingle } from '../middleware/upload.middleware.js';
import {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
} from '../validations/brand.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(brandController.getBrands)
  .post(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadSingle('pic')),
    validate(createBrandSchema),
    brandController.createBrand
  );

router
  .route('/:id')
  .get(validate(brandIdParamSchema), brandController.getBrand)
  .put(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadSingle('pic')),
    validate(updateBrandSchema),
    brandController.updateBrand
  )
  .delete(
    protect,
    authorize(...ADMIN_ROLES),
    validate(brandIdParamSchema),
    brandController.deleteBrand
  );

export default router;
