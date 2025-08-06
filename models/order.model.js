import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true
    },
    userName:{
        type:String
    },
    Email:{
        type:String
    },
    mobile:{
        type:Number
    },
    product_details: {
        _id: String,
        name: String,
        image: Array,
        userId: String
    },
    paymentId: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'ready_to_pick', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment_status: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const OrderModel = mongoose.model('order', orderSchema)
export default OrderModel