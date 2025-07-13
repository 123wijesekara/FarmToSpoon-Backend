
import RatingModel from "../models/Rating.js";
import OrderModel from "../models/order.model.js";


export const rating = async (req, res) => {
  try {
    const { userId, orderId, rating, review } = req.body;

   
    const order = await OrderModel.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    
    const productId = order.product_details?._id;

    if (!productId) {
      return res.status(400).json({ error: "Product ID not found in order" });
    }

   
    const newRating = new RatingModel({
      userId,
      productId, 
      rating,
      review,
    });

    await newRating.save();

    res.status(201).json({ message: "Rating submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET: Get average rating for item
export const getratings = async (req, res) => {
  try {
    const { itemId } = req.params;
    const ratings = await RatingModel.find({ itemId });
    const average =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

    res.json({ averageRating: average.toFixed(1), total: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
