import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { CompanySchema } from '../companies/schemas/company.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb';

async function seedCompanies() {
  try {
    await mongoose.connect(MONGODB_URI);

    const CompanyModel = mongoose.model('Company', CompanySchema);

    const userId = new mongoose.Types.ObjectId('67fa2a3efdcce5e2a4a2dee9');

    const companies = Array.from({ length: 50 }).map(() => ({
      name: faker.company.name(),
      address: faker.location.streetAddress(true),
      description: faker.company.catchPhrase(),
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await CompanyModel.insertMany(companies);
    console.log('✅ Seeded 50 companies successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCompanies();
