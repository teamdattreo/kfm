import mongoose from 'mongoose';
import { PubertyBooking } from '../models/PubertyBooking.js';
import { sendBookingEmails } from '../utils/bookingEmail.js';

export const createPubertyBooking = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['girlName', 'parentName', 'phone','location', 'eventDate', 'package', 'userId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: '* Required – cannot be left blank',
        missingFields
      });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        receivedId: req.body.userId
      });
    }

    // Create booking with user association
    const booking = new PubertyBooking({
      ...req.body,
      user: req.body.userId
    });

    await booking.save();

    try {
      await sendBookingEmails({ bookingType: 'Puberty', booking });
    } catch (emailError) {
      console.error('Booking email failed:', emailError);
    }
    
    res.status(201).json({
      message: "Puberty booking created successfully",
      booking
    });
    
  } catch (err) {
    console.error('Booking creation error:', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors
      });
    }
    
    res.status(500).json({
      message: "Failed to create puberty booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getPubertyBookings = async (req, res) => {
  try {
    let query = {};
    
    // If userId is provided in query, filter by user
    if (req.query.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      query.user = req.query.userId;
    }

    const bookings = await PubertyBooking.find(query)
      .sort({ eventDate: 1 }) // Sort by event date
      .lean(); // Convert to plain JS objects

    res.json(bookings);
  } catch (err) {
    console.error('Error retrieving bookings:', err);
    res.status(500).json({
      message: "Error retrieving puberty bookings",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getUserPubertyBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const bookings = await PubertyBooking.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.json(bookings.map(booking => ({
      ...booking,
      status: booking.status || 'pending'
    })));
  } catch (err) {
    console.error('Error getting puberty bookings:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getPubertyBookingById = async (req, res) => {
  try {
    const booking = await PubertyBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Puberty booking not found" });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Error retrieving booking:', err);
    res.status(500).json({
      message: "Error retrieving puberty booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updatePubertyBookingById = async (req, res) => {
  try {
    const allowedUpdates = ['status', 'eventDate', 'location', 'notes', 'package'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const updated = await PubertyBooking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Puberty booking not found" });
    }
    
    res.json({
      message: "Puberty booking updated successfully",
      booking: updated
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({
      message: "Error updating puberty booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deletePubertyBooking = async (req, res) => {
  try {
    const deleted = await PubertyBooking.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Puberty booking not found" });
    }
    
    res.json({ message: "Puberty booking deleted successfully" });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      message: "Error deleting puberty booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
