import mongoose from "mongoose";


const promotionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PromotionModel = mongoose.model("Promotion", promotionSchema);

export default PromotionModel
