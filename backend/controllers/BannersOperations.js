import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Banner from '../models/Banner.js';

dotenv.config(); // Load environment variables

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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

let currentBannerUrl = '';

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    console.log('File details:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'banners' }
    );

    console.log('Cloudinary upload success:', uploadResult.secure_url);
    
    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

  } catch (error) {
    console.error('SERVER ERROR:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack // Only in development
    });
  }
});





router.get('/current', async (req, res) => {
    try {
      if (!currentBannerUrl) {
        // Optionally fetch the most recent from Cloudinary
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'banners/',
          max_results: 1
        });
  
        if (result.resources.length > 0) {
          currentBannerUrl = result.resources[0].secure_url;
        } else {
          return res.json({ imageUrl: '/default-banner.jpg' });
        }
      }
  
      return res.json({ imageUrl: currentBannerUrl });
  
    } catch (error) {
      console.error('Fetch error:', error);
      return res.json({ imageUrl: '/default-banner.jpg' });
    }
  });
// Get active banner
router.get('/active', async (req, res) => {
  try {
    const activeBanner = await Banner.findOne({ isActive: true })
      .sort({ publishDate: -1 })
      .limit(1);
    
    if (!activeBanner) {
      return res.status(404).json({ 
        success: false,
        message: 'No active banner found' 
      });
    }
    
    res.json({
      success: true,
      data: activeBanner
    });
  } catch (err) {
    console.error('Error fetching active banner:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
});




export default router;
