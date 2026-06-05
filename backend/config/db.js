import mongoose from 'mongoose';
import User from '../models/User.js';
import Component from '../models/Component.js';
import CreditPackage from '../models/CreditPackage.js';
import Transaction from '../models/Transaction.js';
import Purchase from '../models/Purchase.js';
import Review from '../models/Review.js';

// Module-level db singleton — populated after connectDB() resolves
let db = null;

/**
 * Connect to MongoDB Atlas with a managed connection pool.
 * Call ONCE at server startup. After this, getDb() is safe everywhere.
 */
export const connectDB = async () => {
  if (db) return db; // already connected — return existing pool

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,         // up to 10 sockets open simultaneously
    minPoolSize: 2,          // keep at least 2 warm at all times
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });

  console.log(`✓ MongoDB connected: ${conn.connection.host}`);

  // Store models on the singleton so controllers don't import them directly
  db = { 
    User, 
    Component,
    CreditPackage,
    Transaction,
    Purchase,
    Review
  };

  return db;
};

/**
 * Returns { User, Component }.
 * Throws if called before connectDB() has resolved.
 */
export const getDb = () => {
  if (!db) throw new Error('DB not initialised — call connectDB() first');
  return db;
};

/**
 * Exposes the raw Mongoose connection for connect-mongo session store.
 */
export const getMongooseConnection = () => mongoose.connection;
