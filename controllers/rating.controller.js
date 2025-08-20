import OrderModel from "../models/order.model.js";
import RatingModel from "../models/rating.model.js";

// Submit a rating
export const rating = async (req, res) => {
  try {
    const { userId, orderId, rating, review } = req.body;

    // Check order
    const order = await OrderModel.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const productId = order.product_details?._id;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID not found in order" });
    }

    // Check if already rated
    const existingRating = await RatingModel.findOne({ userId, orderId });
    if (existingRating) {
      return res.status(400).json({ success: false, message: "You have already rated this order" });
    }

    // Save new rating
    const newRating = new RatingModel({ userId, productId, orderId, rating, review });
    await newRating.save();

    res.status(201).json({ success: true, message: "Rating submitted!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Check if order already rated
export const checkOrderRating = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    const rating = await RatingModel.findOne({ userId, orderId });
    res.json({ alreadyRated: !!rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get average rating for product
export const getratings = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await RatingModel.find({ productId });

    const average =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

    res.json({
      averageRating: average.toFixed(1),
      total: ratings.length,
      ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
