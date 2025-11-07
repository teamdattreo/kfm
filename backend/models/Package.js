// import mongoose from "mongoose";

// const packageSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Package name is required'],
//     trim: true
//   },
//   photo: {
//     type: String,
//     required: [true, 'Package photo is required']
//   },
//   descriptionPoints: {
//     type: [String],
//     required: [true, 'Description points are required'],
//     validate: {
//       validator: function(points) {
//         return points.length > 0;
//       },
//       message: 'At least one description point is required'
//     }
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [0, 'Price must be a positive number']
//   },
//   type: {
//     type: String,
//     required: [true, 'Package type is required'],
//     enum: {
//       values: ['diamond', 'platinum', 'gold', 'silver'],
//       message: 'Package type must be diamond, platinum, gold, or silver'
//     }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });


// const PackageModel = mongoose.model("Package", packageSchema);

// export default PackageModel;

import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Package name cannot exceed 100 characters']
  },
  descriptionPoints: {
    type: [String],
    required: [true, 'At least one description point is required'],
    validate: {
      validator: function(points) {
        return points.length > 0 && 
               points.every(point => point.trim().length > 0);
      },
      message: 'At least one valid description point is required'
    }
  },
  type: {
    type: String,
    required: [true, 'Package type is required'],
    trim: true,
    lowercase: true, // Always store in lowercase
    // Removed enum validation to allow any type
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
packageSchema.index({ name: 1 });
packageSchema.index({ type: 1 });
packageSchema.index({ createdAt: -1 });

const Package = mongoose.model('Package', packageSchema);

export default Package;