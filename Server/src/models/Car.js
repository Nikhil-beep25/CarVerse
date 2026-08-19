import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a car name'],
      trim: true,
      maxlength: [100, 'Car name cannot exceed 100 characters'],
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Please provide a car brand'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a car category'],
      index: true,
    },
    model: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
      min: [1990, 'Year must be after 1990'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the distant future'],
      default: new Date().getFullYear(),
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please provide daily rental rate'],
      min: [0, 'Daily price cannot be negative'],
    },
    baseRentAmount: {
      type: Number,
      min: [0, 'Base rent cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    finalRentAmount: {
      type: Number,
      min: [0, 'Final rent cannot be negative'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative'],
    },
    seatingCapacity: {
      type: Number,
      default: 4,
      min: [1, 'Capacity must be at least 1'],
      max: [50, 'Capacity cannot exceed 50'],
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    fuel: {
      type: String,
      default: 'Petrol',
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'Manual', 'Automatic', 'Auto'],
      default: 'Automatic',
    },
    drivingMode: {
      type: String,
      default: 'Automatic',
    },
    mileage: {
      type: Number,
      default: 15,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    pic: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: 'Delhi',
      index: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'Sedan',
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

carSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Synchronize rates, fuel/transmission aliases, and image arrays before saving
carSchema.pre('save', function () {
  if (this.isModified('pricePerDay') || this.isModified('discount')) {
    const base = this.pricePerDay || this.baseRentAmount || 0;
    this.baseRentAmount = base;
    const disc = this.discount || 0;
    this.finalRentAmount = Math.round(base - (base * disc) / 100);
  }

  if (this.fuelType && !this.fuel) {
    this.fuel = this.fuelType;
  } else if (this.fuel && !this.fuelType) {
    this.fuelType = this.fuel;
  }

  if (this.transmission && !this.drivingMode) {
    this.drivingMode = this.transmission;
  } else if (this.drivingMode && !this.transmission) {
    this.transmission = this.drivingMode;
  }

  if (this.images && this.images.length > 0 && (!this.pic || this.pic.length === 0)) {
    this.pic = this.images;
  } else if (this.pic && this.pic.length > 0 && (!this.images || this.images.length === 0)) {
    this.images = this.pic;
  }
});

// Compound indexes for high performance querying
carSchema.index({ brand: 1, category: 1, status: 1 });
carSchema.index({ pricePerDay: 1, rating: -1 });

const Car = mongoose.model('Car', carSchema);
export default Car;
