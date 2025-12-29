import express from 'express';
import dotenv from 'dotenv';
import Package from '../models/Package.js';

dotenv.config();
const router = express.Router();

// ✅ Create new package (no image upload, no category)
router.post('/', async (req, res) => {
  try {
    const { name, descriptionPoints, type, category } = req.body;

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
      category,
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
    const { name, descriptionPoints, type,category } = req.body;

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
      category: category || existingPackage.category,
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
