// import { WeddingBooking } from '../models/WeddingBooking.js';

// export const createWeddingBooking = async (req, res) => {
//   try {
//     const booking = new WeddingBooking(req.body);
//     await booking.save();
//     res.status(201).send("Wedding booking created");
//   } catch (err) {
//     res.status(500).send("Failed to create wedding booking");
//   }
// };

// export const getWeddingBookings = async (req, res) => {
//   try {
//     const bookings = await WeddingBooking.find();
//     res.json(bookings);
//   } catch {
//     res.status(500).send("Error retrieving wedding bookings");
//   }
// };

// export const deleteWeddingBooking = async (req, res) => {
//   try {
//     await WeddingBooking.findByIdAndDelete(req.params.id);
//     res.send("Wedding booking deleted");
//   } catch {
//     res.status(500).send("Error deleting wedding booking");
//   }
// };

// export const updateWeddingBooking = async (req, res) => {
//   try {
//     await WeddingBooking.findByIdAndUpdate(req.params.id, req.body);
//     res.send("Wedding booking updated");
//   } catch {
//     res.status(500).send("Error updating wedding booking");
//   }
// };
// export const getWeddingBookingById = async (req, res) => {
//   try {
//     const booking = await WeddingBooking.findById(req.params.id);
//     if (!booking) return res.status(404).send("Wedding booking not found");
//     res.json(booking);
//   } catch (err) {
//     res.status(500).send("Error retrieving wedding booking");
//   }
// };
// export const updateWeddingBookingById = async (req, res) => {
//   try {
//     const updated = await WeddingBooking.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!updated) return res.status(404).send("Wedding booking not found");
//     res.json({ message: "Wedding booking updated", updated });
//   } catch (err) {
//     res.status(500).send("Error updating wedding booking");
//   }
// };

import mongoose from 'mongoose';
import { WeddingBooking } from '../models/WeddingBooking.js';
import { sendBookingEmails } from '../utils/bookingEmail.js';

// Create a new wedding booking
export const createWeddingBooking = async (req, res) => {
  try {
    console.log('Incoming booking data:', req.body);

    // Validate required fields
    const requiredFields = ['customerName', 'brideName', 'groomName', 'location','phone', 'eventDate', 'package', 'userId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: '* Required – cannot be left blank',
        missingFields
      });
    }

    // Create and save booking
    const booking = new WeddingBooking({
      ...req.body,
      user: req.body.userId
    });

    await booking.save();

    try {
      await sendBookingEmails({ bookingType: 'Wedding', booking });
    } catch (emailError) {
      console.error('Booking email failed:', emailError);
    }
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Booking creation error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors
      });
    }

    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all wedding bookings
export const getWeddingBookings = async (req, res) => {
  try {
    const bookings = await WeddingBooking.find();
    res.json(bookings);
  } catch (err) {
    console.error("Error retrieving bookings:", err);
    res.status(500).json({
      message: "Error retrieving wedding bookings",
      error: err.message
    });
  }
};

// Get bookings for a specific user

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const bookings = await WeddingBooking.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.json(bookings.map(booking => ({
      ...booking,
      status: booking.status || 'pending'
    })));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get a specific wedding booking by ID
export const getWeddingBookingById = async (req, res) => {
  try {
    const booking = await WeddingBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Wedding booking not found" });
    }
    
    res.json(booking);
  } catch (err) {
    console.error("Error retrieving booking:", err);
    res.status(500).json({
      message: "Error retrieving wedding booking",
      error: err.message
    });
  }
};

// Update a wedding booking
export const updateWeddingBookingById = async (req, res) => {
  try {
    const allowedUpdates = ['status', 'eventDate', 'receptionDate', 'location', 'notes', 'package'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const updated = await WeddingBooking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Wedding booking not found" });
    }
    
    res.json({
      message: "Wedding booking updated successfully",
      booking: updated
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      message: "Error updating wedding booking",
      error: err.message
    });
  }
};

// Delete a wedding booking
export const deleteWeddingBooking = async (req, res) => {
  try {
    const deleted = await WeddingBooking.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Wedding booking not found" });
    }
    
    res.json({ message: "Wedding booking deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      message: "Error deleting wedding booking",
      error: err.message
    });
  }
};
