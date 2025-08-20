import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  orderId: { type: String, required: true }, // <-- change here
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

// Prevent duplicate rating per user per order
ratingSchema.index({ userId: 1, orderId: 1 }, { unique: true });

const RatingModel = mongoose.model("Rating", ratingSchema);
export default RatingModel;
