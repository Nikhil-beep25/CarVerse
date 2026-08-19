import Car from '../models/Car.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import mongoose from 'mongoose';

/**
 * Helper to resolve Brand ID from ObjectId string or Name
 */
const resolveBrandId = async (brandInput) => {
  if (!brandInput) return null;
  if (mongoose.isValidObjectId(brandInput)) {
    return brandInput;
  }
  const brandDoc = await Brand.findOne({ name: new RegExp(`^${brandInput.trim()}$`, 'i') });
  return brandDoc ? brandDoc._id : null;
};

/**
 * Helper to resolve Category ID from ObjectId string or Name
 */
const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) return null;
  if (mongoose.isValidObjectId(categoryInput)) {
    return categoryInput;
  }
  const catDoc = await Category.findOne({ name: new RegExp(`^${categoryInput.trim()}$`, 'i') });
  return catDoc ? catDoc._id : null;
};

/**
 * Retrieve cars with extensive search, multi-filter, sort, and pagination
 */
export const getAllCars = async (queryParams = {}) => {
  const filterCriteria = {};

  // 1. Search Query (Fuzzy matching on name, description, city, fuelType, transmission, registrationNumber)
  const searchQuery = queryParams.search || queryParams.q;
  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
    const term = searchQuery.trim();
    filterCriteria.$or = [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { city: { $regex: term, $options: 'i' } },
      { type: { $regex: term, $options: 'i' } },
      { fuelType: { $regex: term, $options: 'i' } },
      { drivingMode: { $regex: term, $options: 'i' } },
      { transmission: { $regex: term, $options: 'i' } },
      { registrationNumber: { $regex: term, $options: 'i' } },
    ];
  }

  // 2. Brand Filter (supports name or ID, single or comma-separated)
  if (queryParams.brand) {
    const brandTerms = Array.isArray(queryParams.brand)
      ? queryParams.brand
      : queryParams.brand.split(',');
    const resolvedBrandIds = [];
    for (const b of brandTerms) {
      const id = await resolveBrandId(b);
      if (id) resolvedBrandIds.push(id);
    }
    if (resolvedBrandIds.length > 0) {
      filterCriteria.brand = { $in: resolvedBrandIds };
    }
  }

  // 3. Category Filter (supports name or ID, single or comma-separated)
  if (queryParams.category) {
    const catTerms = Array.isArray(queryParams.category)
      ? queryParams.category
      : queryParams.category.split(',');
    const resolvedCatIds = [];
    for (const c of catTerms) {
      const id = await resolveCategoryId(c);
      if (id) resolvedCatIds.push(id);
    }
    if (resolvedCatIds.length > 0) {
      filterCriteria.category = { $in: resolvedCatIds };
    }
  }

  // 4. Fuel Type Filter
  const fuel = queryParams.fuel || queryParams.fuelType || queryParams.type;
  if (fuel) {
    filterCriteria.$or = filterCriteria.$or || [];
    filterCriteria.$or.push(
      { type: new RegExp(`^${fuel.trim()}$`, 'i') },
      { fuelType: new RegExp(`^${fuel.trim()}$`, 'i') }
    );
  }

  // 5. Transmission / Driving Mode Filter
  const transmission = queryParams.transmission || queryParams.drivingMode;
  if (transmission) {
    filterCriteria.$or = filterCriteria.$or || [];
    filterCriteria.$or.push(
      { drivingMode: new RegExp(`^${transmission.trim()}$`, 'i') },
      { transmission: new RegExp(`^${transmission.trim()}$`, 'i') }
    );
  }

  // 6. Seating Capacity Filter
  const seats = queryParams.seats || queryParams.seatingCapacity;
  if (seats) {
    filterCriteria.seatingCapacity = parseInt(seats, 10);
  }

  // 7. Price Range Filter (minPrice & maxPrice)
  const minPrice = parseFloat(queryParams.minPrice || queryParams.price_gte);
  const maxPrice = parseFloat(queryParams.maxPrice || queryParams.price_lte);
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    filterCriteria.finalRentAmount = {};
    if (!isNaN(minPrice)) filterCriteria.finalRentAmount.$gte = minPrice;
    if (!isNaN(maxPrice)) filterCriteria.finalRentAmount.$lte = maxPrice;
  }

  // 8. Status & Availability Filter
  if (queryParams.status !== undefined) {
    filterCriteria.status = queryParams.status === 'true' || queryParams.status === true;
  }
  if (queryParams.availability || queryParams.availabilityStatus) {
    filterCriteria.availabilityStatus = (queryParams.availability || queryParams.availabilityStatus).toLowerCase();
  }

  // 9. Location / City Filter
  const city = queryParams.city || queryParams.location;
  if (city) {
    filterCriteria.city = new RegExp(`^${city.trim()}$`, 'i');
  }

  // 10. Year Filter
  const year = queryParams.year || queryParams.modelYear;
  if (year) {
    filterCriteria.modelYear = parseInt(year, 10);
  }

  // Base Query
  let query = Car.find(filterCriteria).populate('brand').populate('category');

  // Sorting
  const sortParam = queryParams.sort;
  if (sortParam === 'price_low' || sortParam === 'price-asc') {
    query = query.sort('finalRentAmount');
  } else if (sortParam === 'price_high' || sortParam === 'price-desc') {
    query = query.sort('-finalRentAmount');
  } else if (sortParam === 'rating' || sortParam === 'top_rated') {
    query = query.sort('-ratings');
  } else if (sortParam === 'popular') {
    query = query.sort('-numOfReviews');
  } else if (sortParam === 'oldest') {
    query = query.sort('createdAt');
  } else if (sortParam) {
    const customSort = sortParam.split(',').join(' ');
    query = query.sort(customSort);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 50; // default 50
  const startIndex = (page - 1) * limit;
  const total = await Car.countDocuments(filterCriteria);

  query = query.skip(startIndex).limit(limit);
  const cars = await query;

  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  };

  if (page * limit < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  return { cars, pagination };
};

/**
 * Get single car by ID
 */
export const getCarById = async (id) => {
  const car = mongoose.isValidObjectId(id)
    ? await Car.findById(id).populate('brand').populate('category')
    : await Car.findOne({ _id: id }).populate('brand').populate('category');

  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Car'));
  }
  return car;
};

/**
 * Create a new car with validation & foreign key resolution
 */
export const createCar = async (carData) => {
  const data = { ...carData };

  // Resolve Brand
  if (data.brand) {
    const brandId = await resolveBrandId(data.brand);
    if (brandId) {
      data.brand = brandId;
    } else {
      // Auto-create brand if name provided
      const newBrand = await Brand.create({ name: data.brand.trim() });
      data.brand = newBrand._id;
    }
  }

  // Resolve Category
  if (data.category) {
    const catId = await resolveCategoryId(data.category);
    if (catId) {
      data.category = catId;
    } else {
      // Auto-create category if name provided
      const newCat = await Category.create({ name: data.category.trim() });
      data.category = newCat._id;
    }
  }

  // Unique Registration Number check
  if (data.registrationNumber && data.registrationNumber.trim() !== '') {
    const existingReg = await Car.findOne({
      registrationNumber: new RegExp(`^${data.registrationNumber.trim()}$`, 'i'),
    });
    if (existingReg) {
      throw new BadRequestError(`Car with registration number '${data.registrationNumber}' already exists.`);
    }
  }

  const car = await Car.create(data);
  return await Car.findById(car._id).populate('brand').populate('category');
};

/**
 * Update existing car
 */
export const updateCar = async (id, carData) => {
  const data = { ...carData };

  if (data.brand) {
    const brandId = await resolveBrandId(data.brand);
    if (brandId) data.brand = brandId;
  }

  if (data.category) {
    const catId = await resolveCategoryId(data.category);
    if (catId) data.category = catId;
  }

  // Check unique registration number conflict
  if (data.registrationNumber && data.registrationNumber.trim() !== '') {
    const existingReg = await Car.findOne({
      _id: { $ne: id },
      registrationNumber: new RegExp(`^${data.registrationNumber.trim()}$`, 'i'),
    });
    if (existingReg) {
      throw new BadRequestError(`Another car with registration number '${data.registrationNumber}' already exists.`);
    }
  }

  const car = await Car.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('brand').populate('category');

  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Car'));
  }
  return car;
};

/**
 * Delete car by ID
 */
export const deleteCar = async (id) => {
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    throw new NotFoundError(RESPONSE_MESSAGES.NOT_FOUND('Car'));
  }
  return car;
};

export default {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
