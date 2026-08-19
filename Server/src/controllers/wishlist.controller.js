import * as wishlistService from '../services/wishlist.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const addToWishlist = asyncHandler(async (req, res) => {
  const { item, isNew } = await wishlistService.addToWishlist(req.user._id, req.params.carId);
  return ApiResponse.success(
    res,
    isNew ? 'Vehicle added to your wishlist' : 'Vehicle is already in your wishlist',
    item,
    isNew ? 201 : 200
  );
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const item = await wishlistService.removeFromWishlist(req.user._id, req.params.carId);
  return ApiResponse.success(res, 'Vehicle removed from your wishlist', item);
});

export const getMyWishlist = asyncHandler(async (req, res) => {
  const { items, pagination } = await wishlistService.getUserWishlist(req.user._id, req.query);
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('wishlist items'), items, 200, pagination);
});

export const checkWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.checkWishlistStatus(req.user._id, req.params.carId);
  return ApiResponse.success(res, 'Wishlist status checked', result);
});

export default {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
  checkWishlist,
};
