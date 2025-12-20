

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const router = express.Router();

const parseJsonArray = (value, fieldName) => {
  if (Array.isArray(value)) {
    return { value, error: null };
  }
  if (typeof value === 'undefined') {
    return { value: [], error: null };
  }
  if (typeof value !== 'string') {
    return { value: [], error: `${fieldName} must be an array` };
  }
  if (value.trim() === '') {
    return { value: [], error: null };
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return { value: [], error: `${fieldName} must be an array` };
    }
    return { value: parsed, error: null };
  } catch (err) {
    return { value: [], error: `${fieldName} must be valid JSON` };
  }
};

const isCloudinaryConfigured = () =>
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Invalid file upload'
      });
    }

    return next();
  });
};

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
router.post('/', handleUpload, async (req, res) => {
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

    const colorsParse = parseJsonArray(colors, 'colors');
    if (colorsParse.error) {
      return res.status(400).json({
        success: false,
        error: colorsParse.error
      });
    }

    const sizesParse = parseJsonArray(sizes, 'sizes');
    if (sizesParse.error) {
      return res.status(400).json({
        success: false,
        error: sizesParse.error
      });
    }

    const colorsArray = colorsParse.value
      .map((color) => (typeof color === 'string' ? color.trim() : ''))
      .filter(Boolean);

    const sizesArray = sizesParse.value
      .map((size) => (typeof size === 'string' ? { size } : size))
      .map((size) => ({
        size: typeof size?.size === 'string' ? size.size.trim() : ''
      }))
      .filter((size) => size.size);

    if (colorsArray.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid color is required'
      });
    }

    if (sizesArray.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid size is required'
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        error: 'Image upload is not configured'
      });
    }

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

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
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
router.put('/:id', handleUpload, async (req, res) => {
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

    const hasColors = typeof colors !== 'undefined';
    const hasSizes = typeof sizes !== 'undefined';

    const colorsParse = parseJsonArray(colors, 'colors');
    if (colorsParse.error) {
      return res.status(400).json({
        success: false,
        error: colorsParse.error
      });
    }

    const sizesParse = parseJsonArray(sizes, 'sizes');
    if (sizesParse.error) {
      return res.status(400).json({
        success: false,
        error: sizesParse.error
      });
    }

    const nextColors = hasColors
      ? colorsParse.value
          .map((color) => (typeof color === 'string' ? color.trim() : ''))
          .filter(Boolean)
      : existingProduct.colors;

    const nextSizes = hasSizes
      ? sizesParse.value
          .map((size) => (typeof size === 'string' ? { size } : size))
          .map((size) => ({
            size: typeof size?.size === 'string' ? size.size.trim() : ''
          }))
          .filter((size) => size.size)
      : existingProduct.sizes;

    if (hasColors && nextColors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid color is required'
      });
    }

    if (hasSizes && nextSizes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid size is required'
      });
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct.name,
      code: code || existingProduct.code,
      colors: nextColors,
      sizes: nextSizes,
      updatedAt: new Date()
    };

    // Handle image update if new file was uploaded
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          success: false,
          error: 'Image upload is not configured'
        });
      }

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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;
