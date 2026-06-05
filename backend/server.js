import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB, getMongooseConnection } from './config/db.js';
import componentRoutes from './routes/componentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const startServer = async () => {
  // Establish the connection pool first — getDb() is safe to call after this
  await connectDB();

  const app = express();

  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());

  // Session store reuses the existing Mongoose connection pool — no extra connection opened
  app.use(session({
    name: 'uistore.sid',
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: getMongooseConnection().getClient(),
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }));

  app.use('/api/auth', authRoutes);
  app.use('/api/components', componentRoutes);
  app.use('/api/purchases', purchaseRoutes);
  app.use('/api/transactions', transactionRoutes);

  app.get('/', (req, res) => res.send('UIStore API is running...'));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
