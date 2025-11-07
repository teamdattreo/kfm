import mongoose from 'mongoose';

export const BirthdayBooking = mongoose.model('BirthdayBooking', new mongoose.Schema({
  childName: String,
  parentName: String,
  age: String,
  phone: String,
  email: String,
  eventDate: String,
  location: String,
  theme: String,
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
