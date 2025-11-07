import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true, 
  }, 
  category: {
    type: String,
    required: true,
    enum: ['Portrait', 'Wedding', 'Birthday', 'Shots', 'Shots' , 'Uncategorized'],
    default: 'Uncategorized',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
