import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';
import { updateUserDetails } from './user.controller.js';
import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
 import sendEmail from "../config/sendEmail.js";
 

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const { userId, list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const playload = list_items.map((el) => {
      return {
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          _id: el.productId._id,
          name: el.productId.name,
          image: el.productId.image,
          userId: el.productId.userId,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
        UserId: userId,
        userName: user.name,
        userId: user.userId,
        Email: user.email,
        mobile: user.mobile,
      };
    });

    const generatedOrder = await OrderModel.insertMany(playload);

    // Remove from the cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    /** ---------------------------
     * SEND ORDER CONFIRMATION EMAIL
     * --------------------------- */
    await sendEmail({
      name: user.name,
      sendTo: user.email, // send to user's email
      subject: "Order Confirmation - Farm To Spoon",
      html: `
        <h2>Hi ${user.name},</h2>
        <p>Thank you for your order!</p>
        <p>Your order has been placed successfully.</p>
        <p><b>Order ID:</b> ${generatedOrder[0].orderId}</p>
        <p><b>Total Amount:</b> Rs. ${totalAmt}</p>
        <p>We’ll notify you once it’s ready for pickup 🚚</p>
        <br/>
          <p>Thank you for shopping with us!</p>
      `,
    });

    return response.json({
      message: "Order placed successfully & email sent",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Discount Utility
export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

// export async function paymentController(request,response){
//    try {
//     const userId = request.userId //auth middleware
//     const {list_items,totalAmt,addressId,subTotalAmt}=request.body

//     const user = await  UserModel.findById(userId)
//     const line_items = list_items.map(item=>{
//         return{
//             price_data :{
//                 currency :'inr',
//                 product_data :{
//                     name:item.productId.name,
//                     images:item.productId.image,
//                     metadata:{
//                         productId:item.productId._id
//                     }
//                 },
//                 unit_amount : pricewithDiscount(item.productId.price,item.productId.discount)* 100

//             },
//             adjustable_quantity :{
//                 enabled:true,
//                 minimun:1
//             },
//             quantity :item.quantity
//         }
//     })
//     const params ={
//         submit_type :'pay',
//         mode :'payment',
//         payment_method_type :['card'],
//         customer_email :user.email,
//         metadata:{
//             userId:userId,
//             addressId:addressId
//         },
//         line_items:line_items,
//         success_url:`${process.env.FRONTEND_URL}/success`,
//         cancel_url:`${process.env.FRONTEND_URL}/cancel`
//     }
// const session = await Stripe.checkout.sessions.create(params)

// return response.status(200).json(session)
//    }catch(error){

// return response.status(500).json({
//     message:error.message|| error,
//     error:true,
//     success : false
// })
//    }
   
// }

// const getOrderProductItems =async(
//     lineItems,
//     userId,
//     addressId,
//     paymentId,
//     payment_status

// )=>{
//     const productList =[]

//     if(lineItems?.data?.length){
//         for(const item of lineItems.data){
//             const product = await Stripe.products.retrieve(item.price.product)

//             // console.log("item",item)
//             const  paylod = 
//             {
//                 userId :userId ,
//                 orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId:product.metadata.productId,
//                 product_details: {
//                     name :product.name,
//                     image :product.images,
//                 },
//                 paymentId:paymentId,
//                 payment_status:payment_status,
//                 delivery_address:addressId,
//                 subTotalAmt: Number(item.amount_total/100),
//                 totalAmt : Number(item.amount_total/100),
//             }
//             productList.push(paylod)
//         }
//     }

//     return productList
// }

// export async function webhookStripe(request,response){
//    const event =request.body;

//    const endPointSecret =process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY
//    console.log("event",event)

//    switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;

//       const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
// const userId = session.metadata.userId
//       const orderProduct =await getOrderProductItems(
//         {
//         lineItems :lineItems,
//         userId:userId,
//         addressId: session.metadata.addressId,
//         paymentId:session.payment_intent,
//         payment_status:session.payment_status
//       }
        
//     )
// //  console.log("orderProduct",orderProduct)

//        const order = await OrderModel.insertMany(orderProduct)

//        if(Boolean(order[0])){
//         const removeCartItems =  await UserModel.findByIdAndUpdate(userId,{
//            shopping_cart :[] 
//         })
//         const removeCartProductDB = await  CartProductModel.deleteMany( {userId : userId})
//        }
     
//       break; 
     
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   response.json({received: true});

 
// }

export async function getOrderDetailsController(request,response) {
   
    try{
const { userId } = request.body;  

 
const orderlist = await OrderModel.find({UserId: userId}).sort({createdAt:-1}).populate('delivery_address')
console.log("orderlist",orderlist)
return response.json({
    message:"order list",
    data:orderlist,
    error:false,
    success:true
})
 
    }catch(error){
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}


export async function getFarmerOrdersController(req, res) {
  
    try {
      const farmerId = req.userId;
   
 
      const farmerProducts = await ProductModel.find({ userId: farmerId }, "_id");
      const farmerProductIds = farmerProducts.map(p => new mongoose.Types.ObjectId(p._id));

  
      
      const farmerOrders = await  OrderModel.find({ "product_details._id": { $in: farmerProductIds.map(id => id.toString()) } })

      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .lean();
  
      return res.json({
        message: "Orders for farmer",
        data: farmerOrders,
        success: true,
        error: false
      });
      
    } catch (error) {
        
      return res.status(500).json({
        message: error.message || error,
        success: false,
        error: true
      });
    }
  }

  export async function getBuyerOrdersController(req, res) {
    try {
      const buyerId = req.userId;
   
      
      const buyerOrders = await OrderModel.find({ UserId: buyerId })
        .sort({ createdAt: -1 })
       
        .lean();
      
      return res.json({
        message: "Orders for buyer",
        data: buyerOrders,
        success: true,
        error: false,
      });
  
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Server error",
        success: false,
        error: true,
      });
    }
  }
   

 

//   export async function updateOrderStatusController(req, res) {
//     try {
//       const { orderId, status } = req.body;
  
//       if (!orderId || !status) {
//         return res.status(400).json({
//           message: "Order ID and new status are required",
//           success: false,
//           error: true,
//         });
//       }
  
//       const updated = await OrderModel.findOneAndUpdate(
//         { _id: orderId }, 
//         { status },
//         { new: true }
//       );
  
//       if (!updated) {
//         return res.status(404).json({
//           message: "Order not found",
//           success: false,
//           error: true,
//         });
//       }
  
//       return res.json({
//         message: "Order status updated",
//         success: true,
//         error: false,
//       });
//     } catch (err) {
//       return res.status(500).json({
//         message: err.message || err,
//         success: false,
//         error: true,
//       });
//     }
//   }
  
 

export async function updateOrderStatusController(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Order ID and new status are required",
        success: false,
        error: true,
      });
    }

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "ready_to_pick",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid order status",
      });
    }

    // Update order
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true }
    ).populate("delivery_address");

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    const recipientEmail = updatedOrder.delivery_address?.email || updatedOrder.Email;

    if (recipientEmail) {
      let statusMessage = "";

      switch (status) {
        case "pending":
        case "processing":
        case "shipped":
          statusMessage = `<p>Your order with ID <strong>${orderId}</strong> is now <strong>${status}</strong>.</p>`;
          break;
        case "ready_to_pick":
        
          statusMessage = `<p>Your order with ID <strong>${orderId}</strong> is <strong>${status}</strong>. You can collect it at the pickup point.</p>`;
          break;
          case "delivered":
            statusMessage = `<p>Your order with ID <strong>${orderId}</strong> has been <strong>${status}</strong>. You can now rate your product and provide feedback!</p>
                             <p><a href="" target="_blank" style="color: #2F855A; text-decoration: underline;">Click here to rate your product</a></p>`;
            break;
        
        case "cancelled":
          statusMessage = `<p>Your order with ID <strong>${orderId}</strong> has been cancelled.</p>`;
          break;
      }

      const html = `
        <h2>Order Status Update</h2>
        ${statusMessage}
        <p>Thank you for shopping with us!</p>
      `;

      await sendEmail({
        sendTo: recipientEmail,
        subject: `Order Status Updated: ${status}`,
        html,
      });
    }

    return res.json({
      message: "Order status updated and notification sent",
      success: true,
      error: false,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

 
