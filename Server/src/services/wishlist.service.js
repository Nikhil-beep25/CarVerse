import Wishlist from '../models/Wishlist.js';
import Car from '../models/Car.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

/**
 * Add Car to User's Wishlist
 */
export const addToWishlist = async (userId, carId) => {
  if (!mongoose.isValidObjectId(carId)) {
    throw new BadRequestError('Invalid car ID format');
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Vehicle'));
  }

  // Idempotent find or create
  let item = await Wishlist.findOne({ user: userId, car: carId });
  if (item) {
    return { item, isNew: false };
  }

  item = await Wishlist.create({
    user: userId,
    car: carId,
  });

  return { item, isNew: true };
};

/**
 * Remove Car from User's Wishlist
 */
export const removeFromWishlist = async (userId, carId) => {
  if (!mongoose.isValidObjectId(carId)) {
    throw new BadRequestError('Invalid car ID format');
  }

  const item = await Wishlist.findOneAndDelete({ user: userId, car: carId });
  if (!item) {
    throw new NotFoundError('Vehicle not found in your wishlist');
  }

  return item;
};

/**
 * Get Customer's Wishlist
 */
export const getUserWishlist = async (userId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Wishlist.countDocuments({ user: userId });
  const items = await Wishlist.find({ user: userId })
    .populate({
      path: 'car',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'category', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Filter out any entries where the referenced car might have been deleted
  const validItems = items.filter((w) => w.car !== null);

  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  };

  return { items: validItems, pagination };
};

/**
 * Check if a car is in user's wishlist
 */
export const checkWishlistStatus = async (userId, carId) => {
  if (!mongoose.isValidObjectId(carId)) {
    return { inWishlist: false };
  }

  const item = await Wishlist.findOne({ user: userId, car: carId });
  return { inWishlist: !!item };
};

export default {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkWishlistStatus,
};
