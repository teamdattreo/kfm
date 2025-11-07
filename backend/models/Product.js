// import mongoose from "mongoose";

// const sizePriceSchema = new mongoose.Schema({
//   size: {
//     type: String,
//     required: [true, 'Size is required']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [0, 'Price must be a positive number']
//   }
// });

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true
//   },
//   code: {
//     type: String,
//     required: [true, 'Product code is required'],
//     unique: true,
//     trim: true
//   },
//   photo: {
//     type: String,
//     required: [true, 'Product photo is required']
//   },
//   colors: {
//     type: [String],
//     required: [true, 'Colors are required'],
//     validate: {
//       validator: function(colors) {
//         return colors.length > 0;
//       },
//       message: 'At least one color is required'
//     }
//   },
//   sizes: {
//     type: [sizePriceSchema],
//     required: [true, 'Sizes are required'],
//     validate: {
//       validator: function(sizes) {
//         return sizes.length > 0;
//       },
//       message: 'At least one size is required'
//     }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });


// const ProductModel = mongoose.model("Product", productSchema);

// export default ProductModel;

import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, 'Size name is required'],
    trim: true,
    maxlength: [50, 'Size name cannot exceed 50 characters']
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Product code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'Product code cannot exceed 50 characters']
  },
  colors: {
    type: [String],
    required: [true, 'At least one color is required'],
    validate: {
      validator: function(colors) {
        return colors.length > 0 && 
               colors.every(color => color.trim().length > 0);
      },
      message: 'At least one valid color is required'
    }
  },
  sizes: {
    type: [sizeSchema],
    required: [true, 'At least one size is required'],
    validate: {
      validator: function(sizes) {
        return sizes.length > 0;
      },
      message: 'At least one size is required'
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(url) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
      },
      message: 'Invalid image URL'
    }
  },
  cloudinaryId: {
    type: String,
    select: false
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
productSchema.index({ name: 1 });
productSchema.index({ code: 1 }, { unique: true });
productSchema.index({ createdAt: -1 });

productSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;