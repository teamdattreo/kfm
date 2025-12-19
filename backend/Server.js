// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import compression from 'compression';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import path from 'path';
// import PackageOperation from './controllers/PackageOperation.js'
// import ProductOperation from './controllers/ProductOperation.js'
// import BannerOperation from './controllers/BannerOperation.js'
// import { fileURLToPath } from 'url';

// import ExpenseController from './controllers/ExpenseController.js'
// import UserOperations from './controllers/UserOperations.js'
// import BannersOperations from './controllers/BannersOperations.js'
// import BannersUI from './controllers/BannersUI.js'

// // Initialize environment variables
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// import galleryRoutes from './routes/Galleryroutes.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const NODE_ENV = process.env.NODE_ENV || 'development';

// const app = express();

// const MAX_FILE_SIZE = 10 * 1024 * 1024; //10MB maxsize

// app.use(helmet());
// app.disable('x-powered-by');

// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// app.use(limiter);

// app.use(compression());
// app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// app.use(cors({
//   origin: NODE_ENV === 'production'
//     ? [process.env.PRODUCTION_URL]
//     : ['http://localhost:3000', 'http://localhost:5173'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// // Body parsers
// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ extended: true, limit: '100mb' }));



// // app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// app.use("/ExpenseController", ExpenseController);
// app.use("/UserOperations", UserOperations);


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/BannersOperations', BannersOperations);
// app.use('/BannersUI', BannersUI);
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
// });

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });


// app.post('/test-multer', testUpload.single('image'), (req, res) => {
//   if (!req.file) {
//     console.log('❌ No file received');
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   console.log('✅ File received:', req.file.originalname);
//   res.status(200).json({ message: 'File received', filename: req.file.originalname });
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'mern_uploads', // Optional: Cloudinary folder
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//   },
// });

// const cloudinaryParser = multer({
//   storage: cloudinaryStorage,
//   limits: { fileSize: MAX_FILE_SIZE }
// });

// app.post('/test-cloudinary', cloudinaryParser.single('image'), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
//   console.log('✅ Test upload file info:', req.file);
//   res.json({ message: 'Upload test successful', imageUrl: req.file.path });
// });

// app.use('/gallery', galleryRoutes);

// app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// app.use("/PackageOperation",PackageOperation)
// app.use("/ProductOperation",ProductOperation)
// app.use("/Banner",BannerOperation)

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

// // Error handler
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ message: 'Something went wrong!' });
// // });

// app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// app.use((err, req, res, next) => {
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(413).json({ message: 'File too large. Max size is 10MB.' });
//   }
//   console.error('❌ Unhandled error:', err.message);
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false,
//     message: 'Internal server error',
//     error: err.message 
//   });
// });

// // Database connection
// // mongoose.connect(process.env.DB)
// //   .then(() => console.log('✅ Connected to MongoDB'))
// //   .catch(err => {
// //     console.error('❌ MongoDB connection error:', err);
// //     process.exit(1);
// //   });

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
// // });











// mongoose.connect(process.env.db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => console.log('❌ MongoDB connection error:', err));

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
// });
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import PackageOperation from './controllers/PackageOperation.js'
import ProductOperation from './controllers/ProductOperation.js'
import BannerOperation from './controllers/BannerOperation.js'
import PromotionOperation from './controllers/PromotionOperation.js'
import { fileURLToPath } from 'url';

import ExpenseController from './controllers/ExpenseController.js'
import UserOperations from './controllers/UserOperations.js'
import BannersOperations from './controllers/BannersOperations.js'
import BannersUI from './controllers/BannersUI.js'
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


// Initialize environment variables
dotenv.config();

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express
const app = express();

// Security Middlewares
app.use(helmet());
app.disable('x-powered-by');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use(limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// CORS
app.use(cors({
  origin: NODE_ENV === 'production' ? [process.env.PRODUCTION_URL] : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());  // Ensure preflight request is handled


// Body parsers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));



// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


app.use("/ExpenseController", ExpenseController);
app.use("/UserOperations", UserOperations);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/BannersOperations', BannersOperations);
app.use('/BannersUI', BannersUI);




app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use("/PackageOperation",PackageOperation)
app.use("/ProductOperation",ProductOperation)
app.use("/Banner",BannerOperation)
app.use('/gallery', galleryRoutes);
app.use("/promotions",PromotionOperation)
// Wedding Booking Routes
app.post('/weddingBooking', createWeddingBooking);
app.get('/weddingBooking', getWeddingBookings);
app.get('/weddingBooking/user/:userId', getUserBookings); // Changed this line
app.get('/weddingBooking/:id', getWeddingBookingById);
app.put('/weddingBooking/:id', updateWeddingBookingById);
app.delete('/weddingBooking/:id', deleteWeddingBooking);

// Birthday Booking Routes
app.post('/birthdayBooking', BirthdayBookingController.createBirthdayBooking);
app.get('/birthdayBooking', BirthdayBookingController.getBirthdayBookings);
app.get('/birthdayBooking/user/:userId', BirthdayBookingController.getUserBirthdayBookings); // Changed this line
app.get('/birthdayBooking/:id', BirthdayBookingController.getBirthdayBookingById);
app.put('/birthdayBooking/:id', BirthdayBookingController.updateBirthdayBookingById);
app.delete('/birthdayBooking/:id', BirthdayBookingController.deleteBirthdayBooking);

// Puberty Booking Routes
app.post('/pubertyBooking', PubertyBookingController.createPubertyBooking);
app.get('/pubertyBooking', PubertyBookingController.getPubertyBookings);
app.get('/pubertyBooking/user/:userId', PubertyBookingController.getUserPubertyBookings); // Changed this line
app.get('/pubertyBooking/:id', PubertyBookingController.getPubertyBookingById);
app.put('/pubertyBooking/:id', PubertyBookingController.updatePubertyBookingById);
app.delete('/pubertyBooking/:id', PubertyBookingController.deletePubertyBooking);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  });
});

// Database connection
// mongoose.connect(process.env.DB)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
// });









mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error:", err));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
