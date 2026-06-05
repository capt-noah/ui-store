import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Component from './models/Component.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    const filePath = path.join(__dirname, '../components.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await Component.deleteMany({});
    console.log('Cleared existing components.');

    await Component.insertMany(data);
    console.log('Successfully seeded components from components.json!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
