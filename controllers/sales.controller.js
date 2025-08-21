 
// import ProductModel from "../models/product.model.js";
// import RatingModel from "../models/rating.model.js";
// import OrderModel from '../models/order.model.js';
 

// export const getSalesReport = async (req, res) => {
//   try {
//     const { farmerId, range = "monthly" } = req.body; 
   
//     console.log("farmerId", farmerId);
//     let dateFilter = {};
//     const now = new Date();

//     if (range === "daily") {
//       dateFilter = { $gte: new Date(now.setHours(0,0,0,0)) };
//     } else if (range === "weekly") {
//       const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
//       dateFilter = { $gte: startOfWeek };
//     } else if (range === "monthly") {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       dateFilter = { $gte: startOfMonth };
//     } else if (range === "yearly") {
//       const startOfYear = new Date(now.getFullYear(), 0, 1);
//       dateFilter = { $gte: startOfYear };
//     }

    
//     const orders = await OrderModel.find({
//       createdAt: dateFilter,
//       "product_details.userId": farmerId
//     });

//     const totalOrders = orders.length;
//     const totalSales = orders.reduce((acc, o) => acc + (o.totalAmt || 0), 0);

    
//     const productCounts = {};
//     orders.forEach(o => {
//       if (o.product_details?._id) {
//         const pid = o.product_details._id;
//         productCounts[pid] = (productCounts[pid] || 0) + 1;
//       }
//     });

//     const topProducts = await ProductModel.find({
//       _id: { $in: Object.keys(productCounts) }
//     });
 
    
//     const ratings = await RatingModel.aggregate([
//       {
//         $lookup: {
//           from: "orders",              
//           localField: "orderId",       
//           foreignField: "orderId",    
//           as: "order"
//         }
//       },
//       { $unwind: "$order" },       
//       { $match: { "order.product_details.userId": farmerId } },
      
//       {
//         $group: {
//           _id: "$productId",          
//           avgRating: { $avg: "$rating" },
//           totalRatings: { $sum: 1 },
//           productName: { $first: "$order.product_details.name" },
//           productImage: { $first: { $arrayElemAt: ["$order.product_details.image", 0] } }
//         }
//       },
//       { $sort: { avgRating: -1 } }   
//     ]);
    
 
//     return res.json({
//       success: true,
//       message: "Report generated",
//       data: {
//         totalSales,
//         totalOrders,
//         topProducts,
//         ratings
//       }
//     });
//   } catch (err) {
//     console.error("Error in getSalesReport", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };
 // controllers/report.controller.js
import ProductModel from "../models/product.model.js";
import RatingModel from "../models/rating.model.js";
import OrderModel from '../models/order.model.js';

export const getSalesReport = async (req, res) => {
  try {
    const { farmerId, range = "monthly", month, year } = req.body;
    console.log("farmerId", farmerId, "range:", range, "month:", month, "year:", year);

    let dateFilter = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const selectedYear = year || currentYear;
    const selectedMonth = month ? parseInt(month) : now.getMonth() + 1;

    if (range === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      dateFilter = { $gte: startOfDay, $lte: endOfDay };
    } else if (range === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      dateFilter = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (range === "monthly") {
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
      dateFilter = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (range === "yearly") {
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
      dateFilter = { $gte: startOfYear, $lte: endOfYear };
    }

    // Get orders with product revenue calculation
    const orders = await OrderModel.find({
      createdAt: { ...dateFilter },
      "product_details.userId": String(farmerId)
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, o) => acc + (o.totalAmt || 0), 0);
    
    // Calculate product revenue and quantities by measurement type
    const productRevenue = {};
    orders.forEach(o => {
      if (o.product_details?._id) {
        const pid = o.product_details._id;
        
        // Convert Mongoose document to plain JavaScript object to access all fields
        const productDetails = o.product_details.toObject ? o.product_details.toObject() : o.product_details;
        
        // Handle different quantity formats and measurement types
        let quantity = 0;
        let measurementType = 'units'; // Default measurement type
        
        // DEBUG: Log the complete product_details structure
        console.log("Complete product_details for", productDetails.name, ":", JSON.stringify(productDetails, null, 2));
        
        // Check for all possible quantity fields in product_details
        if (productDetails.unit !== undefined && productDetails.unit !== null) {
          // Product measured in units
          quantity = parseFloat(productDetails.unit) || 0;
          measurementType = 'units';
          console.log("Found unit:", productDetails.unit, "for product:", productDetails.name);
        } 
        else if (productDetails.kg !== undefined && productDetails.kg !== null) {
          // Product measured in kg
          quantity = parseFloat(productDetails.kg) || 0;
          measurementType = 'kg';
          console.log("Found kg:", productDetails.kg, "for product:", productDetails.name);
        }
        else if (productDetails.quantity !== undefined && productDetails.quantity !== null) {
          // Product measured in quantity
          quantity = parseFloat(productDetails.quantity) || 0;
          measurementType = 'units';
          console.log("Found quantity:", productDetails.quantity, "for product:", productDetails.name);
        }
        // Check for other potential quantity fields
        else if (productDetails.weight !== undefined && productDetails.weight !== null) {
          quantity = parseFloat(productDetails.weight) || 0;
          measurementType = 'kg';
          console.log("Found weight:", productDetails.weight, "for product:", productDetails.name);
        }
        else if (productDetails.amount !== undefined && productDetails.amount !== null) {
          quantity = parseFloat(productDetails.amount) || 0;
          measurementType = 'units';
          console.log("Found amount:", productDetails.amount, "for product:", productDetails.name);
        }
        else if (productDetails.qty !== undefined && productDetails.qty !== null) {
          quantity = parseFloat(productDetails.qty) || 0;
          measurementType = 'units';
          console.log("Found qty:", productDetails.qty, "for product:", productDetails.name);
        }
        else {
          quantity = 1;
          measurementType = 'units';
          console.warn(`No quantity found for order ${o.orderId}, product: ${productDetails.name}, defaulting to 1`);
          console.log("Available fields in product_details:", Object.keys(productDetails));
        }
        
        // Calculate revenue using totalAmt from the order
        const revenue = parseFloat(o.totalAmt) || 0;
        
        console.log("Final calculation - Order:", o.orderId, "Product:", productDetails.name, 
                    "Revenue:", revenue, "Quantity:", quantity, "Measurement:", measurementType);
        
        if (!productRevenue[pid]) {
          productRevenue[pid] = {
            revenue: 0,
            quantity: 0,
            measurementType: measurementType,
            name: productDetails.name,
            image: productDetails.image?.[0] || ''
          };
        }
        
        // Ensure we're adding the same measurement type
        if (productRevenue[pid].measurementType !== measurementType) {
          console.warn(`Measurement type mismatch for product ${pid}: ${productRevenue[pid].measurementType} vs ${measurementType}`);
          // Convert quantities to the same measurement type if needed
          if (productRevenue[pid].measurementType === 'kg' && measurementType === 'units') {
            // Convert units to kg (assuming 1 unit = 1 kg for conversion)
            quantity = quantity * 1;
            measurementType = 'kg';
          } else if (productRevenue[pid].measurementType === 'units' && measurementType === 'kg') {
            // Convert kg to units (assuming 1 kg = 1 unit for conversion)
            quantity = quantity * 1;
            measurementType = 'units';
          }
        }
        
        productRevenue[pid].revenue += revenue;
        productRevenue[pid].quantity += quantity;
      }
    });

    // Get top products with revenue - limited to top 10
    const productIds = Object.keys(productRevenue);
    let topProducts = [];
    
    if (productIds.length > 0) {
      // First try to get product details from database to get accurate measurement types
      const productsFromDB = await ProductModel.find({
        _id: { $in: productIds }
      }).lean();

      // Create a map for quick lookup
      const productMap = {};
      productsFromDB.forEach(p => {
        productMap[p._id.toString()] = p;
      });

      // Process each product with proper measurement types
      topProducts = productIds.map(pid => {
        const dbProduct = productMap[pid];
        const revenueData = productRevenue[pid];
        
        // Determine the correct measurement type
        let measurementType = revenueData.measurementType;
        let quantityDisplay = revenueData.quantity;
        
        // If we have product data from DB, use its measurement type
        if (dbProduct && dbProduct.measurementType) {
          measurementType = dbProduct.measurementType;
        }
        
        // Format quantity with appropriate unit
        const quantityWithUnit = `${quantityDisplay} ${measurementType}`;
        console.log(`Top Product: ${dbProduct?.name || revenueData.name}, Revenue: ${revenueData.revenue}, Quantity: ${quantityWithUnit}`);
        
        return {
          _id: pid,
          name: dbProduct?.name || revenueData.name,
          image: dbProduct?.image?.[0] || revenueData.image,
          description: dbProduct?.description || '',
          category: dbProduct?.category || '',
          revenue: revenueData.revenue,
          quantity: revenueData.quantity,
          measurementType: measurementType,
          quantityWithUnit: quantityWithUnit
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    }

    // Ratings
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
      { $match: { 
        "order.product_details.userId": String(farmerId),
        "order.createdAt": { ...dateFilter }
      }},
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

    // Sales by date for charts
    let groupByFormat = {};
    if (range === "daily") {
      groupByFormat = {
        hour: { $hour: "$createdAt" }
      };
    } else if (range === "weekly") {
      groupByFormat = {
        day: { $dayOfMonth: "$createdAt" }
      };
    } else if (range === "monthly") {
      groupByFormat = {
        day: { $dayOfMonth: "$createdAt" }
      };
    } else if (range === "yearly") {
      groupByFormat = {
        month: { $month: "$createdAt" }
      };
    }

    const salesByDate = await OrderModel.aggregate([
      { 
        $match: { 
          createdAt: { ...dateFilter }, 
          "product_details.userId": String(farmerId) 
        } 
      },
      {
        $group: {
          _id: groupByFormat,
          totalSales: { $sum: "$totalAmt" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    return res.json({
      success: true,
      message: "Report generated",
      data: {
        totalSales,
        totalOrders,
        topProducts,
        ratings,
        salesByDate,
        selectedMonth,
        selectedYear
      }
    });

  } catch (err) {
    console.error("Error in getSalesReport", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};