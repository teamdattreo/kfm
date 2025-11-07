// import express from "express";
// import Promotion from "../models/Promotion.js";

// const router = express.Router();




// router.get('/', async (req, res) => {
//   try {
//     const promotions = await Promotion.find().sort({ createdAt: -1 });
//     res.json(promotions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const promotion = new Promotion(req.body);
//     await promotion.save();
//     res.status(201).json(promotion);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// export default router

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Promotion from '../models/Promotion.js'; // Assuming you have a Mongoose model

dotenv.config();

const router = express.Router();

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

// Create new promotion with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        success: false,
        error: 'Description is required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Promotion image is required' 
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { 
        folder: 'promotions',
        transformation: [
          { width: 1200, height: 630, crop: 'fill' },
          { quality: 'auto' }
        ]
      }
    );

    // Save to database
    const newPromotion = new Promotion({
      description,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      createdAt: new Date()
    });

    await newPromotion.save();

    res.status(201).json({
      success: true,
      promotion: {
        id: newPromotion._id,
        description: newPromotion.description,
        imageUrl: newPromotion.imageUrl,
        createdAt: newPromotion.createdAt
      }
    });

  } catch (error) {
    console.error('Promotion creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create promotion',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Get all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find({}); // This gets all promotions from MongoDB
    res.status(200).json(promotions); // Send as JSON array
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Failed to load promotions' });
  }
});

// Get single promotion
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .select('description imageUrl createdAt');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Promotion not found'
      });
    }

    res.json({
      success: true,
      promotion
    });

  } catch (error) {
    console.error('Fetch promotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch promotion'
    });
  }
});

// // Delete promotion
// router.delete('/:id', async (req, res) => {
//   try {
//     const promotions = await Promotion.findById(req.params.id);

//     if (!promotions) {
//       return res.status(404).json({
//         success: false,
//         error: 'Promotion not found'
//       });
//     }

//     // Delete from Cloudinary first
//     await cloudinary.uploader.destroy(promotions.cloudinaryId);

//     // Then delete from database
//     await promotions.remove();

//     res.json({
//       success: true,
//       message: 'Promotion deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete promotion error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to delete promotion'
//     });
//   }
// });

// DELETE a promotion
router.delete('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;