import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { optionalUpload, uploadSingle } from '../middleware/upload.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from '../validations/category.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .get(categoryController.getCategories)
  .post(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadSingle('pic')),
    validate(createCategorySchema),
    categoryController.createCategory
  );

router
  .route('/:id')
  .get(validate(categoryIdParamSchema), categoryController.getCategory)
  .put(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadSingle('pic')),
    validate(updateCategorySchema),
    categoryController.updateCategory
  )
  .delete(
    protect,
    authorize(...ADMIN_ROLES),
    validate(categoryIdParamSchema),
    categoryController.deleteCategory
  );

export default router;
