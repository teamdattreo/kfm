import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import {
  createGalleryImage,
  getGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/Gallerycontroller.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern_uploads', // Optional: Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});



dotenv.config(); // Load environment variables



// Verify Cloudinary config
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

let currentBannerUrl = '';

const parser = multer({ storage });

router.post('/upload', parser.single('image'), createGalleryImage);
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImageById);
router.put('/:id', parser.single('image'), updateGalleryImage);
router.delete('/:id', deleteGalleryImage);

export default router;
