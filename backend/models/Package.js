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
  category: {
    type: String,
    required: [true, 'Package category is required'],
    trim: true,
    lowercase: true, 
  },
  type: {
    type: String,
    required: [true, 'Package type is required'],
    trim: true,
    lowercase: true,
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
packageSchema.index({ category: 1 });
packageSchema.index({ createdAt: -1 });

const Package = mongoose.model('Package', packageSchema);

export default Package;