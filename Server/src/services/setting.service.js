import Setting from '../models/Setting.js';
import { NotFoundError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

export const getSetting = async () => {
  let setting = await Setting.findOne();
  if (!setting) {
    // Initialize default setting if not found
    setting = await Setting.create({
      siteName: 'CarVerse',
      address: 'A-52, Sector 16, Noida, Near Community Center Sector 15',
      email: 'nikhilbhadauriya2500@gmail.com',
      phone: '8077313959',
      whatsapp: '8077313959',
      github: 'https://github.com/Nikhil-beep25',
      linkedin: 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321',
      youtube: 'https://www.youtube.com/@ItsNikhilTech',
      instagram: 'https://www.instagram.com/itsnikhil_tech',
    });
  }
  return [setting]; // Frontend expects array with setting at [0]
};

export const createOrUpdateSetting = async (data) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create(data);
  } else {
    setting = await Setting.findByIdAndUpdate(setting._id, data, { new: true, runValidators: true });
  }
  return setting;
};

export const updateSettingById = async (id, data) => {
  const setting = await Setting.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!setting) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Setting'));
  }
  return setting;
};

export default {
  getSetting,
  createOrUpdateSetting,
  updateSettingById,
};
