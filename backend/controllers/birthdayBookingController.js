import mongoose from 'mongoose';
import { BirthdayBooking } from '../models/BirthdayBooking.js';

export const createBirthdayBooking = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['childName', 'parentName', 'age', 'phone', 'eventDate', 'location','package', 'userId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: '* Required – cannot be left blank.',
        missingFields
      });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format' 
      });
    }

    // Create booking with user association
    const booking = new BirthdayBooking({
      ...req.body,
      user: req.body.userId
    });

    await booking.save();
    
    res.status(201).json({
      message: "Birthday booking created successfully",
      booking
    });
    
  } catch (err) {
    console.error('Booking creation error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors
      });
    }
    
    res.status(500).json({
      message: "Failed to create birthday booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getBirthdayBookings = async (req, res) => {
  try {
    let query = {};
    
    // If userId is provided in query, filter by user
    if (req.query.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      query.user = req.query.userId;
    }

    const bookings = await BirthdayBooking.find(query)
      .sort({ eventDate: 1 }) // Sort by event date
      .lean(); // Convert to plain JS objects

    res.json(bookings);
  } catch (err) {
    console.error('Error retrieving bookings:', err);
    res.status(500).json({
      message: "Error retrieving birthday bookings",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// birthdayBookingController.js
export const getUserBirthdayBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const bookings = await BirthdayBooking.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .select('-__v') // Exclude version key
      .lean();

    res.json(bookings.map(booking => ({
      ...booking,
      status: booking.status || 'pending' // Ensure status exists
    })));
  } catch (err) {
    console.error('Error getting birthday bookings:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getBirthdayBookingById = async (req, res) => {
  try {
    const booking = await BirthdayBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Birthday booking not found" });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Error retrieving booking:', err);
    res.status(500).json({
      message: "Error retrieving birthday booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateBirthdayBookingById = async (req, res) => {
  try {
    // Allow only specific fields to be updated including status
    const allowedUpdates = ['status', 'eventDate', 'location', 'notes', 'package'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const updated = await BirthdayBooking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only update the fields that are passed in
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Birthday booking not found" });
    }
    
    res.json({
      message: "Birthday booking updated successfully",
      booking: updated
    });
  } catch (err) {
    console.error('Update error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors
      });
    }
    
    res.status(500).json({
      message: "Error updating birthday booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deleteBirthdayBooking = async (req, res) => {
  try {
    const deleted = await BirthdayBooking.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Birthday booking not found" });
    }
    
    res.json({ message: "Birthday booking deleted successfully" });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      message: "Error deleting birthday booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};