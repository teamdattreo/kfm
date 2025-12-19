

import express from "express";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Banner from "../models/Banner.js";
import { check, validationResult } from 'express-validator';

dotenv.config();

const router = express.Router();
dotenv.config();


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



let currentBannerUrl = '';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// CORS middleware
// router.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// Get active banners
router.get('/active', async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true
    }).sort({ publishDate: -1 });

    res.json(banners);
  } catch (err) {
    console.error('Error fetching active banners:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active banners',
      error: err.message
    });
  }
});

// Create new banner with image upload
router.post('/', 
  upload.single('image'),
  [
    check('publishDate').notEmpty().withMessage('Publish date is required')
      .isISO8601().withMessage('Valid date is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'Banner image is required' 
        });
      }

      const { publishDate, isActive = true } = req.body;
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { 
          folder: 'kfm-banners',
          transformation: [
            { width: 1920, height: 1080, crop: 'fill' },
            { quality: 'auto' }
          ]
        }
      );

      const banner = new Banner({
        imageUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        publishDate: new Date(publishDate),
        isActive,
        createdAt: new Date()
      });

      await banner.save();

      return res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner
      });

    } catch (err) {
      console.error('Error creating banner:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error',
        error: err.message 
      });
    }
  }
);

// Get all banners (admin only)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update banner with optional image update
router.put('/:id', 
  upload.single('image'),
  [
    check('publishDate', 'Valid date is required').optional().isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { publishDate, isActive } = req.body;
      
      // Find the existing banner
      const existingBanner = await Banner.findById(id);
      if (!existingBanner) {
        return res.status(404).json({ message: 'Banner not found' });
      }

      // Prepare update data
      const updateData = {
        publishDate: publishDate ? new Date(publishDate) : existingBanner.publishDate,
        isActive: isActive !== undefined ? isActive : existingBanner.isActive,
        updatedAt: new Date()
      };

      // Handle image update if new file was uploaded
      if (req.file) {
        // First delete old image from Cloudinary if it exists
        if (existingBanner.cloudinaryId) {
          await cloudinary.uploader.destroy(existingBanner.cloudinaryId);
        }

        // Upload new image
        const uploadResult = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          { 
            folder: 'kfm-banners',
            transformation: [
              { width: 1920, height: 1080, crop: 'fill' },
              { quality: 'auto' }
            ]
          }
        );

        updateData.imageUrl = uploadResult.secure_url;
        updateData.cloudinaryId = uploadResult.public_id;
      }

      // Update the banner
      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      res.json({
        success: true,
        data: updatedBanner
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
);

// Delete banner
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Delete from Cloudinary if exists
    if (banner.cloudinaryId) {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
    }

    res.json({ message: 'Banner removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
