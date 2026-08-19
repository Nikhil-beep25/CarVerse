import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a brand name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Brand name cannot exceed 100 characters'],
    },
    pic: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

brandSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
