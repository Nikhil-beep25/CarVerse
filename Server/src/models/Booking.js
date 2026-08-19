import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
      index: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Booking must belong to a car'],
      index: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please provide a pickup date'],
      index: true,
    },
    dropoffDate: {
      type: Date,
      required: [true, 'Please provide a dropoff / return date'],
      index: true,
    },
    pickupLocation: {
      type: String,
      required: [true, 'Please provide a pickup location'],
      trim: true,
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Please provide a dropoff location'],
      trim: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: [1, 'Total days must be at least 1'],
    },
    pricePerDay: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price cannot be negative'],
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    insurance: {
      type: Number,
      default: 0,
    },
    driverFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    bookingStatus: {
      type: String,
      enum: [
        'PENDING',
        'CONFIRMED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED',
        'REJECTED',
        'Pending',
        'Confirmed',
        'Active',
        'Completed',
        'Cancelled',
        'Rejected',
      ],
      default: 'PENDING',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'PENDING',
      index: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    customerNotes: {
      type: String,
      trim: true,
      default: '',
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Compound index for availability conflict lookups
bookingSchema.index({ car: 1, bookingStatus: 1, pickupDate: 1, dropoffDate: 1 });
// Compound index for user booking queries
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
