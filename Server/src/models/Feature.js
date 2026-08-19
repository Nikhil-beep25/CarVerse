import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a feature name'],
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      required: [true, 'Please provide a feature icon'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a feature description'],
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

featureSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Feature = mongoose.model('Feature', featureSchema);
export default Feature;
