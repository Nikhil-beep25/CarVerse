import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a service name'],
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      required: [true, 'Please provide a service icon'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a service description'],
      trim: true,
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

serviceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
