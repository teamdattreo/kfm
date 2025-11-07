import mongoose from 'mongoose';

export const WeddingBooking = mongoose.model('WeddingBooking', new mongoose.Schema({
  customerName: String,
  brideName: String,
  groomName: String,
  brideFather: String,
  brideMother: String,
  groomFather: String,
  groomMother: String,
  phone: String,
  email: String,
  eventDate: String,
  bookingDate: String,
  receptionDate: String,
  location: String,
  storageName: String,
  notes: String,
  package: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));