import mongoose, { mongo } from "mongoose";

const cartProductSchema =new mongoose.Schema({
    productId :{
        type :mongoose.Schema.ObjectId,
        ref :'product'
    },
    quantity :{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps :true
})

const CarProductModel =mongoose.model('cartProduct',cartProductSchema)
export default CarProductModel
