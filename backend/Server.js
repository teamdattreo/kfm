import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import PackageOperation from './controllers/PackageOperation.js';
import ProductOperation from './controllers/ProductOperation.js';
import BannerOperation from './controllers/BannerOperation.js';
import PromotionOperation from './controllers/PromotionOperation.js';
import ExpenseController from './controllers/ExpenseController.js';
import UserOperations from './controllers/UserOperations.js';
import BannersOperations from './controllers/BannersOperations.js';
import BannersUI from './controllers/BannersUI.js';
import {
  createWeddingBooking,
  getWeddingBookings,
  getUserBookings,
  getWeddingBookingById,
  updateWeddingBookingById,
  deleteWeddingBooking
} from './controllers/weddingBookingController.js';
import * as BirthdayBookingController from './controllers/birthdayBookingController.js';
import * as PubertyBookingController from './controllers/pubertyBookingController.js';
import galleryRoutes from './routes/Galleryroutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4000;

const app = express();

const corsOptions = {
  origin: (origin, cb) => {
    const allowed = ['http://localhost:5173', 'https://www.studiokfm.com'];
    if (!origin || allowed.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Standard middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
  })
);
app.disable('x-powered-by');
app.use(compression());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Routes
app.use('/PackageOperation', PackageOperation);
app.use('/ProductOperation', ProductOperation);
app.use('/Banner', BannerOperation);
app.use('/promotions', PromotionOperation);
app.use('/ExpenseController', ExpenseController);
app.use('/UserOperations', UserOperations);
app.use('/BannersOperations', BannersOperations);
app.use('/BannersUI', BannersUI);
app.use('/gallery', galleryRoutes);

// Wedding Booking Routes
app.post('/weddingBooking', createWeddingBooking);
app.get('/weddingBooking', getWeddingBookings);
app.get('/weddingBooking/user/:userId', getUserBookings);
app.get('/weddingBooking/:id', getWeddingBookingById);
app.put('/weddingBooking/:id', updateWeddingBookingById);
app.delete('/weddingBooking/:id', deleteWeddingBooking);

// Birthday Booking Routes
app.post('/birthdayBooking', BirthdayBookingController.createBirthdayBooking);
app.get('/birthdayBooking', BirthdayBookingController.getBirthdayBookings);
app.get('/birthdayBooking/user/:userId', BirthdayBookingController.getUserBirthdayBookings);
app.get('/birthdayBooking/:id', BirthdayBookingController.getBirthdayBookingById);
app.put('/birthdayBooking/:id', BirthdayBookingController.updateBirthdayBookingById);
app.delete('/birthdayBooking/:id', BirthdayBookingController.deleteBirthdayBooking);

// Puberty Booking Routes
app.post('/pubertyBooking', PubertyBookingController.createPubertyBooking);
app.get('/pubertyBooking', PubertyBookingController.getPubertyBookings);
app.get('/pubertyBooking/user/:userId', PubertyBookingController.getUserPubertyBookings);
app.get('/pubertyBooking/:id', PubertyBookingController.getPubertyBookingById);
app.put('/pubertyBooking/:id', PubertyBookingController.updatePubertyBookingById);
app.delete('/pubertyBooking/:id', PubertyBookingController.deletePubertyBooking);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://admin:admin@nikshan.rdttf.mongodb.net/',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

export default app;
