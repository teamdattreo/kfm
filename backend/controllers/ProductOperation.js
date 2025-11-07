// import express from "express";
// import ProductModel from "../models/Product.js";
// import jwt from "jsonwebtoken";
// // import { JWT_SECRET } from "../config.js";

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

// // Create Product with URL
// router.post("/", authenticateUser, async (req, res) => {
//     try {
//         const { name, code, photo, colors, sizes } = req.body;
        
//         // Validate URL format
//         if (photo && !photo.match(/^https?:\/\/.+\/.+$/)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid photo URL format"
//             });
//         }

//         // Check if product code already exists
//         const existingProduct = await ProductModel.findOne({ code });
//         if (existingProduct) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product code must be unique"
//             });
//         }

//         const newProduct = new ProductModel({
//             name,
//             code,
//             photo: photo || null,
//             colors: Array.isArray(colors) ? colors : [colors],
//             sizes: Array.isArray(sizes) ? sizes : [sizes]
//         });

//         await newProduct.save();
        
//         res.status(201).json({
//             success: true,
//             message: "Product created successfully!",
//             data: newProduct
//         });
//     } catch (err) {
//         console.error('Error creating product:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error creating product",
//             error: err.message
//         });
//     }
// });

// // Get All Products
// router.get("/", async (req, res) => {
//     try {
//         const products = await ProductModel.find().sort({ createdAt: -1 });
//         res.json({
//             success: true,
//             count: products.length,
//             data: products
//         });
//     } catch (err) {
//         console.error('Error fetching products:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching products",
//             error: err.message
//         });
//     }
// });

// // Get Single Product
// router.get("/:id", async (req, res) => {
//     try {
//         const product = await ProductModel.findById(req.params.id);
        
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }
        
//         res.json({
//             success: true,
//             data: product
//         });
//     } catch (err) {
//         console.error('Error fetching product:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching product",
//             error: err.message
//         });
//     }
// });

// // Update Product with URL
// router.put("/:id", authenticateUser, async (req, res) => {
//     try {
//         const { name, code, photo, colors, sizes } = req.body;
        
//         // Validate URL format
//         if (photo && !photo.match(/^https?:\/\/.+\/.+$/)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid photo URL format"
//             });
//         }

//         const updateData = {
//             name,
//             code,
//             photo: photo || null,
//             colors: Array.isArray(colors) ? colors : [colors],
//             sizes: Array.isArray(sizes) ? sizes : [sizes]
//         };

//         // Check if product code is being changed to an existing one
//         if (code) {
//             const existingProduct = await ProductModel.findOne({ 
//                 code,
//                 _id: { $ne: req.params.id } // Exclude current product
//             });
//             if (existingProduct) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Product code must be unique"
//                 });
//             }
//         }

//         const updatedProduct = await ProductModel.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true, runValidators: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Product updated successfully!",
//             data: updatedProduct
//         });
//     } catch (err) {
//         console.error('Error updating product:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error updating product",
//             error: err.message
//         });
//     }
// });

// // Delete Product
// router.delete("/:id", authenticateUser, async (req, res) => {
//     try {
//         const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
        
//         if (!deletedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Product deleted successfully!"
//         });
//     } catch (err) {
//         console.error('Error deleting product:', err);
//         res.status(500).json({
//             success: false,
//             message: "Error deleting product",
//             error: err.message
//         });
//     }
// });

// export default router;


import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const router = express.Router();

// Cloudinary configuration
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

// Create new product with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, code, colors, sizes } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and code are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Product image is required' 
      });
    }

    // Convert colors and sizes from string to array if needed
    const colorsArray = Array.isArray(colors) ? colors : JSON.parse(colors || '[]');
    const sizesArray = Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]');

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { 
        folder: 'kfm-products',
        transformation: [
          { width: 1200, height: 630, crop: 'fill' },
          { quality: 'auto' }
        ]
      }
    );

    // Save to database
    const newProduct = new Product({
      name,
      code,
      colors: colorsArray,
      sizes: sizesArray,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      createdAt: new Date()
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      product: newProduct
    });

  } catch (error) {
    console.error('Product creation error:', error);
    
    if (error.code === 11000 && error.keyPattern.code) {
      return res.status(400).json({
        success: false,
        error: 'Product code must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});


// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to load products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name code colors sizes imageUrl createdAt');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete from Cloudinary if exists
    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, colors, sizes } = req.body;
    
    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct.name,
      code: code || existingProduct.code,
      colors: Array.isArray(colors) ? colors : JSON.parse(colors || JSON.stringify(existingProduct.colors)),
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes || JSON.stringify(existingProduct.sizes)),
      updatedAt: new Date()
    };

    // Handle image update if new file was uploaded
    if (req.file) {
      // First delete old image from Cloudinary if it exists
      if (existingProduct.cloudinaryId) {
        await cloudinary.uploader.destroy(existingProduct.cloudinaryId);
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { 
          folder: 'kfm-products',
          transformation: [
            { width: 1200, height: 630, crop: 'fill' },
            { quality: 'auto' }
          ]
        }
      );

      updateData.imageUrl = uploadResult.secure_url;
      updateData.cloudinaryId = uploadResult.public_id;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      product: updatedProduct // Changed from gpackages to product
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;