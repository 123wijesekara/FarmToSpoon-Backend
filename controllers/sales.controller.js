 
import ProductModel from "../models/product.model.js";
import RatingModel from "../models/rating.model.js";

import OrderModel from '../models/order.model.js';
 

export const getSalesReport = async (req, res) => {
  try {
    const { farmerId, range = "monthly" } = req.body; 
   
    console.log("farmerId", farmerId);
    let dateFilter = {};
    const now = new Date();

    if (range === "daily") {
      dateFilter = { $gte: new Date(now.setHours(0,0,0,0)) };
    } else if (range === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      dateFilter = { $gte: startOfWeek };
    } else if (range === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { $gte: startOfMonth };
    } else if (range === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { $gte: startOfYear };
    }

    
    const orders = await OrderModel.find({
      createdAt: dateFilter,
      "product_details.userId": farmerId
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, o) => acc + (o.totalAmt || 0), 0);

    
    const productCounts = {};
    orders.forEach(o => {
      if (o.product_details?._id) {
        const pid = o.product_details._id;
        productCounts[pid] = (productCounts[pid] || 0) + 1;
      }
    });

    const topProducts = await ProductModel.find({
      _id: { $in: Object.keys(productCounts) }
    });
 
    
    const ratings = await RatingModel.aggregate([
      {
        $lookup: {
          from: "orders",              
          localField: "orderId",       
          foreignField: "orderId",    
          as: "order"
        }
      },
      { $unwind: "$order" },       
      { $match: { "order.product_details.userId": farmerId } },
      
      {
        $group: {
          _id: "$productId",          
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          productName: { $first: "$order.product_details.name" },
          productImage: { $first: { $arrayElemAt: ["$order.product_details.image", 0] } }
        }
      },
      { $sort: { avgRating: -1 } }   
    ]);
    
 
    return res.json({
      success: true,
      message: "Report generated",
      data: {
        totalSales,
        totalOrders,
        topProducts,
        ratings
      }
    });
  } catch (err) {
    console.error("Error in getSalesReport", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
