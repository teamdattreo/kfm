// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// // Configure Cloudinary (replace with your credentials)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // Upload to Cloudinary using streams (better for large files)
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: 'banners' }, // Optional folder in Cloudinary
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };
// // Updated upload handler
// router.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//       console.log('Received file:', req.file); // Debug logging
      
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file provided' });
//       }
  
//       // Verify file exists
//       if (!req.file.buffer) {
//         return res.status(400).json({ error: 'Invalid file format' });
//       }
  
//       const result = await cloudinary.uploader.upload(
//         `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
//         { folder: 'banners' }
//       );
  
//       res.json({
//         success: true,
//         url: result.secure_url
//       });
  
//     } catch (error) {
//       console.error('Upload failed:', error);
//       res.status(500).json({ 
//         success: false,
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   });

// // Get current banner
// router.get('/current', async (req, res) => {
//   try {
//     // Retrieve from database
//     // Example: const banner = await BannerModel.findOne().sort({ createdAt: -1 });
//     // res.json({ imageUrl: banner?.imageUrl || '' });
    
//     res.json({ imageUrl: currentBannerUrl }); // Replace with your database logic
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch banner' });
//   }
// });

// export default router;

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





export default router;