import {Router} from 'express';
import auth from '../middleware/auth.js';
import { CashOnDeliveryOrderController, getBuyerOrdersController, getFarmerOrdersController, getOrderDetailsController,updateOrderStatusController } from '../controllers/order.controller.js';

const orderRouter = Router()


orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
//orderRouter.post('/checkout',auth,paymentController)
//orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",getOrderDetailsController)
orderRouter.get("/getFarmerOrdersController",auth,getFarmerOrdersController)

 
 
orderRouter.put('/updateOrderStatus', auth, updateOrderStatusController);
orderRouter.get('/updateBuyerOrderStatus', auth, getBuyerOrdersController);
 

export default orderRouter
