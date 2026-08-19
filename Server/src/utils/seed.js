import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import Car from '../models/Car.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for Seeding');

    // Clear existing data
    await Car.deleteMany();
    await Brand.deleteMany();
    await Category.deleteMany();

    const dataPath = path.resolve(__dirname, '../../data.json');
    if (!fs.existsSync(dataPath)) {
      logger.warn(`Seed data file not found at: ${dataPath}`);
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // 1. Seed Brands
    const brandMap = {};
    if (data.brand && data.brand.length > 0) {
      for (const b of data.brand) {
        const brand = await Brand.create({
          name: b.name,
          status: b.status,
          pic: b.pic || '',
        });
        brandMap[b.name.toLowerCase()] = brand._id;
      }
      logger.info(`Seeded ${data.brand.length} Brands`);
    }

    // 2. Seed Categories
    const categoryMap = {};
    if (data.category && data.category.length > 0) {
      for (const c of data.category) {
        const category = await Category.create({
          name: c.name,
          status: c.status,
          pic: c.pic || '',
        });
        categoryMap[c.name.toLowerCase()] = category._id;
      }
      logger.info(`Seeded ${data.category.length} Categories`);
    }

    // 3. Seed Cars
    if (data.car && data.car.length > 0) {
      let carCount = 0;
      for (const car of data.car) {
        let brandId = brandMap[car.brand?.toLowerCase()];
        if (!brandId) {
          const newBrand = await Brand.create({ name: car.brand || 'Unknown', status: true });
          brandId = newBrand._id;
          brandMap[car.brand?.toLowerCase()] = brandId;
        }

        let categoryId = categoryMap[car.category?.toLowerCase()];
        if (!categoryId) {
          const newCat = await Category.create({ name: car.category || 'Unknown', status: true });
          categoryId = newCat._id;
          categoryMap[car.category?.toLowerCase()] = categoryId;
        }

        const baseRent = Number(car.baseRentAmount) || 2000;
        const discountVal = Number(car.discount) || 0;

        await Car.create({
          name: car.name,
          brand: brandId,
          category: categoryId,
          description: car.description || 'An excellent choice for your next journey. Reliable and comfortable.',
          baseRentAmount: baseRent,
          pricePerDay: baseRent,
          discount: discountVal,
          pic: car.pic || [],
          status: car.status ?? true,
          seatingCapacity: Number(car.seatingCapacity) || 5,
          drivingMode: car.drivingMode || 'Manual',
          type: car.type || 'Petrol',
          registrationNumber: car.registrationNumber || `DL01AB${Math.floor(1000 + Math.random() * 9000)}`,
        });
        carCount++;
      }
      logger.info(`Seeded ${carCount} Cars successfully`);
    }

    logger.info('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    logger.error(`Database Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
