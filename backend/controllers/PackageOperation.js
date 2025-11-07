// import express from "express";
// import PackageModel from "../models/Package.js";
// import jwt from "jsonwebtoken";

// const router = express.Router();
// const JWT_SECRET = 'jiggujigurailkilambuthupaar'; 


// // CORS Middleware
// router.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
    
//     if (req.method === 'OPTIONS') {
//       return res.status(200).end();
//     }
    
//     next();
// });

// // Authentication Middleware
// const authenticateUser = (req, res, next) => {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Authentication token required' 
//       });
//     }
  
//     const token = authHeader.split(' ')[1];
    
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.userId = decoded.userId;
//       next();
//     } catch (err) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }
// };

// // Create Package with URL
// router.post("/", authenticateUser, async (req, res) => {
//     try {
//         const { name, photo, descriptionPoints, price, type } = req.body;
        
//         // Validate URL format
//         if (photo && !photo.match(/^https?:\/\/.+\/.+$/)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid photo URL format"
//             });
//         }

//         // Convert descriptionPoints to array if it's a string
//         const pointsArray = Array.isArray(descriptionPoints) 
//             ? descriptionPoints 
//             : descriptionPoints.split(',').map(point => point.trim());

//         const newPackage = new PackageModel({
//             name,
//             photo: photo || null,
//             descriptionPoints: pointsArray,
//             price: parseFloat(price),
//             type
//         });

//         await newPackage.save();
        
//         res.status(201).json({
//             success: true,
//             message: "Package created successfully!",
//             data: newPackage
//         });
//     } catch (err) {
//         console.error('Error creating package:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error creating package",
//             error: err.message
//         });
//     }
// });

// // Get All Packages
// router.get("/", async (req, res) => {
//     try {
//         const packages = await PackageModel.find().sort({ createdAt: -1 });
//         res.json({
//             success: true,
//             count: packages.length,
//             data: packages
//         });
//     } catch (err) {
//         console.error('Error fetching packages:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching packages",
//             error: err.message
//         });
//     }
// });

// // Get Single Package
// router.get("/:id", async (req, res) => {
//     try {
//         const Package = await PackageModel.findById(req.params.id);
        
//         if (!Package) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Package not found"
//             });
//         }
        
//         res.json({
//             success: true,
//             data: Package
//         });
//     } catch (err) {
//         console.error('Error fetching package:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching package",
//             error: err.message
//         });
//     }
// });

// // Update Package with URL
// router.put("/:id", authenticateUser, async (req, res) => {
//     try {
//         const { name, photo, descriptionPoints, price, type } = req.body;
        
//         // Validate URL format
//         if (photo && !photo.match(/^https?:\/\/.+\/.+$/)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid photo URL format"
//             });
//         }

//         // Convert descriptionPoints to array if it's a string
//         const pointsArray = Array.isArray(descriptionPoints) 
//             ? descriptionPoints 
//             : descriptionPoints.split(',').map(point => point.trim());

//         const updateData = {
//             name,
//             photo: photo || null,
//             descriptionPoints: pointsArray,
//             price: parseFloat(price),
//             type
//         };

//         const updatedPackage = await PackageModel.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true, runValidators: true }
//         );

//         if (!updatedPackage) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Package not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Package updated successfully!",
//             data: updatedPackage
//         });
//     } catch (err) {
//         console.error('Error updating package:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error updating package",
//             error: err.message
//         });
//     }
// });

// // Delete Package
// router.delete("/:id", authenticateUser, async (req, res) => {
//     try {
//         const deletedPackage = await PackageModel.findByIdAndDelete(req.params.id);
        
//         if (!deletedPackage) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Package not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Package deleted successfully!"
//         });
//     } catch (err) {
//         console.error('Error deleting package:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error deleting package",
//             error: err.message
//         });
//     }
// });

// export default router;

// import express from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// import Package from '../models/Package.js';

// dotenv.config();

// const router = express.Router();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { 
//     fileSize: 5 * 1024 * 1024, // 5MB
//     files: 1
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// // Create new package with image upload
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { name, descriptionPoints, category, type } = req.body;
    
//     if (!name || !type) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Name, category and type are required' 
//       });
//     }

//     // Convert descriptionPoints from string to array if needed
//     const pointsArray = Array.isArray(descriptionPoints) ? 
//       descriptionPoints : 
//       JSON.parse(descriptionPoints || '[]');

//     // if (!req.file) {
//     //   return res.status(400).json({ 
//     //     success: false,
//     //     error: 'Package image is required' 
//     //   });
//     // }

//     // Upload to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(
//       `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
//       { 
//         folder: 'kfm-packages',
//         transformation: [
//           { width: 1200, height: 630, crop: 'fill' },
//           { quality: 'auto' }
//         ]
//       }
//     );

//     // Save to database
//     const newPackage = new Package({
//       name,
//       descriptionPoints: pointsArray,
//       //category,
//       type,
//       //imageUrl: uploadResult.secure_url,
//      // cloudinaryId: uploadResult.public_id,
//       createdAt: new Date()
//     });

//     await newPackage.save();

//     res.status(201).json({
//       success: true,
//       package: newPackage
//     });

//   } catch (error) {
//     console.error('Package creation error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to create package',
//       ...(process.env.NODE_ENV === 'development' && { details: error.message })
//     });
//   }
// });

// // Get all packages
// router.get('/', async (req, res) => {
//   try {
//     const packages = await Package.find({});
//     res.status(200).json(packages);
//   } catch (error) {
//     console.error('Error fetching packages:', error);
//     res.status(500).json({ message: 'Failed to load packages' });
//   }
// });

// // Get single package
// router.get('/:id', async (req, res) => {
//   try {
//     const gpackages = await Package.findById(req.params.id)
//       .select('name descriptionPoints category type imageUrl createdAt');

//     if (!gpackages) {
//       return res.status(404).json({
//         success: false,
//         error: 'Package not found'
//       });
//     }

//     res.json({
//       success: true,
//       gpackages
//     });

//   } catch (error) {
//     console.error('Fetch package error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch package'
//     });
//   }
// });

// // Delete package
// router.delete('/:id', async (req, res) => {
//   try {
//     const Packages = await Package.findByIdAndDelete(req.params.id);
    
//     if (!Packages) {
//       return res.status(404).json({ message: 'Package not found' });
//     }

//     // Delete from Cloudinary if exists
//     if (Packages.cloudinaryId) {
//       await cloudinary.uploader.destroy(Packages.cloudinaryId);
//     }

//     res.json({ message: 'Package deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update package
// router.put('/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, descriptionPoints, category, type } = req.body;
    
//     // Find the existing package
//     const existingPackage = await Package.findById(id);
//     if (!existingPackage) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Package not found' 
//       });
//     }

//     // Prepare update data
//     const updateData = {
//       name: name || existingPackage.name,
//       descriptionPoints: Array.isArray(descriptionPoints) 
//         ? descriptionPoints 
//         : JSON.parse(descriptionPoints || JSON.stringify(existingPackage.descriptionPoints)),
//       category: category || existingPackage.category,
//       type: type || existingPackage.type,
//       updatedAt: new Date()
//     };

//     // Handle image update if new file was uploaded
//     if (req.file) {
//       // First delete old image from Cloudinary if it exists
//       if (existingPackage.cloudinaryId) {
//         await cloudinary.uploader.destroy(existingPackage.cloudinaryId);
//       }

//       // Upload new image
//       const uploadResult = await cloudinary.uploader.upload(
//         `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
//         { 
//           folder: 'kfm-packages',
//           transformation: [
//             { width: 1200, height: 630, crop: 'fill' },
//             { quality: 'auto' }
//           ]
//         }
//       );

//       updateData.imageUrl = uploadResult.secure_url;
//       updateData.cloudinaryId = uploadResult.public_id;
//     }

//     // Update the package
//     const updatedPackage = await Package.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true } // Return the updated document
//     );

//     res.status(200).json({
//       success: true,
//       package: updatedPackage
//     });

//   } catch (error) {
//     console.error('Package update error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to update package',
//       ...(process.env.NODE_ENV === 'development' && { details: error.message })
//     });
//   }
// });


// export default router;


import express from 'express';
import dotenv from 'dotenv';
import Package from '../models/Package.js';

dotenv.config();
const router = express.Router();

// ✅ Create new package (no image upload, no category)
router.post('/', async (req, res) => {
  try {
    const { name, descriptionPoints, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Name and type are required'
      });
    }

    // Convert descriptionPoints from string to array if needed
    const pointsArray = Array.isArray(descriptionPoints)
      ? descriptionPoints
      : JSON.parse(descriptionPoints || '[]');

    const newPackage = new Package({
      name,
      descriptionPoints: pointsArray,
      type,
      createdAt: new Date()
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      package: newPackage
    });

  } catch (error) {
    console.error('Package creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create package',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// ✅ Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({});
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Failed to load packages' });
  }
});

// ✅ Get single package
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).select('name descriptionPoints type createdAt');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      package: pkg
    });

  } catch (error) {
    console.error('Fetch package error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch package'
    });
  }
});

// ✅ Delete package
router.delete('/:id', async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({ message: 'Package deleted' });

  } catch (err) {
    console.error('Delete package error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update package
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, descriptionPoints, type } = req.body;

    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    const updatedData = {
      name: name || existingPackage.name,
      descriptionPoints: Array.isArray(descriptionPoints)
        ? descriptionPoints
        : JSON.parse(descriptionPoints || JSON.stringify(existingPackage.descriptionPoints)),
      type: type || existingPackage.type,
      updatedAt: new Date()
    };

    const updatedPackage = await Package.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      success: true,
      package: updatedPackage
    });

  } catch (error) {
    console.error('Package update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update package',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;
