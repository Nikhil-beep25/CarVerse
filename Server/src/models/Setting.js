import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'CarVerse',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    map1: {
      type: String,
      default: '',
      trim: true,
    },
    map2: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: 'nikhilbhadauriya2500@gmail.com',
      trim: true,
    },
    phone: {
      type: String,
      default: '8077313959',
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '8077313959',
      trim: true,
    },
    github: {
      type: String,
      default: 'https://github.com/Nikhil-beep25',
      trim: true,
    },
    facebook: {
      type: String,
      default: '',
      trim: true,
    },
    twitter: {
      type: String,
      default: '',
      trim: true,
    },
    instagram: {
      type: String,
      default: 'https://www.instagram.com/itsnikhil_tech',
      trim: true,
    },
    youtube: {
      type: String,
      default: 'https://www.youtube.com/@ItsNikhilTech',
      trim: true,
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321',
      trim: true,
    },
    privacyPolicy: {
      type: String,
      default: '',
    },
    dataPolicy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

settingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
