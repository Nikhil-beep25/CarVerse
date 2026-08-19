import * as settingService from '../services/setting.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getSetting();
  return ApiResponse.success(res, RESPONSE_MESSAGES.FETCHED_ALL('Settings'), settings);
});

export const createSetting = asyncHandler(async (req, res) => {
  const setting = await settingService.createOrUpdateSetting(req.body);
  return ApiResponse.created(res, RESPONSE_MESSAGES.CREATED('Setting'), setting);
});

export const updateSetting = asyncHandler(async (req, res) => {
  const id = req.params.id || req.body.id || req.body._id;
  const setting = id
    ? await settingService.updateSettingById(id, req.body)
    : await settingService.createOrUpdateSetting(req.body);
  return ApiResponse.success(res, RESPONSE_MESSAGES.UPDATED('Setting'), setting);
});

export default {
  getSettings,
  createSetting,
  updateSetting,
};
