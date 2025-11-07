import mongoose from 'mongoose';

export const PubertyBooking = mongoose.model('PubertyBooking', new mongoose.Schema({
  girlName: String,
  parentName: String,
  phone: String,
  email: String,
  eventDate: String,
  bookingDate: String,
  location: String,
  outfitChange: String,
  storageName: String,
  notes: String,
  package: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}));