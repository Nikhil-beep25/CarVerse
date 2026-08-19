import express from 'express';
import * as carController from '../controllers/car.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { optionalUpload, uploadAny } from '../middleware/upload.middleware.js';
import {
  createCarSchema,
  updateCarSchema,
  carIdParamSchema,
} from '../validations/car.validation.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import { logger } from '../utils/logger.js';

console.log('Car routes loaded successfully');

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    console.log('GET /api/v1/cars called');
    return carController.getCars(req, res, next);
  })
  .post(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadAny()),
    validate(createCarSchema),
    carController.createCar
  );

router
  .route('/:id')
  .get(validate(carIdParamSchema), carController.getCar)
  .put(
    protect,
    authorize(...ADMIN_ROLES),
    optionalUpload(uploadAny()),
    validate(updateCarSchema),
    carController.updateCar
  )
  .delete(
    protect,
    authorize(...ADMIN_ROLES),
    validate(carIdParamSchema),
    carController.deleteCar
  );

export default router;
