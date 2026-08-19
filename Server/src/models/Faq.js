import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide a FAQ question'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Please provide a FAQ answer'],
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

faqSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Faq = mongoose.model('Faq', faqSchema);
export default Faq;
