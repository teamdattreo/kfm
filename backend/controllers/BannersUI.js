
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

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





  ///////////////////////////////

  router.post('/upload1', upload.single('image'), async (req, res) => {
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
        { folder: 'banners1' }
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
  
  
  
  router.get('/current1', async (req, res) => {
    console.log('Received request for current banner');
    
    try {
      // Fetch the most recent image from Cloudinary
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'banners1/',
        max_results: 1,
        sort_by: 'uploaded_at',
        direction: 'desc'
      });
  
      if (result.resources.length > 0) {
        const bannerUrl = result.resources[0].secure_url;
        console.log('Found banner image:', bannerUrl);
        return res.json({
          success: true,
          imageUrl: bannerUrl
        });
      }
  
      console.log('No banners found in Cloudinary, using default');
      return res.json({
        success: true,
        imageUrl: '/default-banner.jpg'
      });
  
    } catch (error) {
      console.error('Error fetching banner:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch banner',
        error: error.message
      });
    }
  });









export default router;