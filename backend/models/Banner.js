// import mongoose from "mongoose";

// const bannerSchema = new mongoose.Schema({
//   imageUrl: {
//     type: String,
//     required: [true, 'Image URL is required'],
//     // validate: {
//     //   validator: function(v) {
//     //     return /^https?:\/\/.+\..+/.test(v);
//     //   },
//     //   message: props => `${props.value} is not a valid URL!`
//     // }
//   },
//   publishDate: {
//     type: Date,
//     required: [true, 'Publish date is required'],
//     default: Date.now
//   },
//   expireDate: {
//     type: Date,
//     validate: {
//       validator: function(v) {
//         if (!v) return true;
//         return v > this.publishDate;
//       },
//       message: 'Expire date must be after publish date'
//     }
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // // Static method to get active banners
// // bannerSchema.statics.getActiveBanners = function() {
// //   const now = new Date();
// //   return this.find({
// //     isActive: true,
// //     publishDate: { $lte: now },
// //     $or: [
// //       { expireDate: null },
// //       { expireDate: { $gt: now } }
// //     ]
// //   }).sort({ publishDate: -1 });
// // };




// const BannerModel = mongoose.model("Banner", bannerSchema);

// export default BannerModel;

import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  // Cloudinary image URL
  imageUrl: {
    type: String,
    required: true
  },
  
  // Cloudinary public ID for image management
  cloudinaryId: {
    type: String,
    required: true
  },
  
  // Date when the banner should become active
  publishDate: {
    type: Date,
    required: true
  },
  
  // Flag to enable/disable the banner
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bannerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update the updatedAt field before updating
bannerSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;