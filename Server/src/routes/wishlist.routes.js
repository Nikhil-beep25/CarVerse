import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { wishlistCarParamSchema } from '../validations/wishlist.validation.js';

const router = express.Router();

// All wishlist operations require authentication
router.use(protect);

router.get('/', wishlistController.getMyWishlist);

router.get('/check/:carId', validate(wishlistCarParamSchema), wishlistController.checkWishlist);

router.post('/:carId', validate(wishlistCarParamSchema), wishlistController.addToWishlist);

router.delete('/:carId', validate(wishlistCarParamSchema), wishlistController.removeFromWishlist);

export default router;
