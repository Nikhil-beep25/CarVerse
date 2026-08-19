import mongoose from 'mongoose';
import Car from './Car.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a customer'],
      index: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Review must belong to a vehicle'],
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Review must be linked to a completed booking'],
      unique: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [5, 'Review comment must be at least 5 characters'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED'],
      default: 'APPROVED',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Compound indexes for high performance query & aggregation
reviewSchema.index({ car: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

/**
 * Static method to calculate average rating and total reviews for a car
 */
reviewSchema.statics.calculateAverageRating = async function (carId) {
  const stats = await this.aggregate([
    {
      $match: {
        car: new mongoose.Types.ObjectId(carId),
        status: 'APPROVED',
      },
    },
    {
      $group: {
        _id: '$car',
        numOfReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    const computedAvg = Math.round(stats[0].avgRating * 10) / 10;
    await Car.findByIdAndUpdate(carId, {
      rating: computedAvg,
      ratings: computedAvg,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await Car.findByIdAndUpdate(carId, {
      rating: 0,
      ratings: 0,
      numOfReviews: 0,
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.car);
});

// Call calculateAverageRating after findOneAndDelete / findOneAndRemove / deleteOne
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.car);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
