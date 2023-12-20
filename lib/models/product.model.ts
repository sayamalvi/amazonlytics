import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    img: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [
      {
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    averagePrice: { type: Number },
    discountRate: { type: String },
    isOutOfStock: { type: Boolean, default: false },
    category: { type: String, required: true },
    reviewCount: { type: String, required: true },
    reviewRating: { type: String, required: true },
    description: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { timestamps: true }
);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
