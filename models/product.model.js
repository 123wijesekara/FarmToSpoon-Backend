// // import mongoose from "mongoose";

// // const productSchema =new mongoose.Schema({
    
// //     name:{
// //         type:String,
// //     },
// //     image:{
// //         type:Array,
// //         default:[]
// //     },
// //     category:[{
// //         type: mongoose.Schema.ObjectId,
// //         ref :'category'
        
// //     }
// //     ],
// //     subCategory:[
// //         {
// //             type :mongoose.Schema.ObjectId,
// //             ref:'subCategory'
// //         }
// //     ],
// //     unit :{
// //         type :String,
// //         default:""
// //     },
// //     stock :{
// //         type :Number,
// //         default:null
// //     },
// //     price:{
// //         type:Number,
// //         default:null
// //     },
// //     discount:{
// //         type:Number,
// //         default:null
// //     },
// //     description:{
// //         type :String,
// //         default:""
// //     },
// //     more_details:{
// //         type:Object,
// //         default:{}
// //     },
// //     public:{
// //         type:Boolean,
// //         default:true
// //     }
// // },{
// //     timestamps:true
// // })


// // productSchema.index({
// //     name :"text",
// //     description:"text"
// // },{
// //     name:10,
// //     description:5
// // })
// // const ProductModel =mongoose.model('product',productSchema)


// // export default ProductModel

// import mongoose from "mongoose";
// const productSchema = new mongoose.Schema(
//     {
//       name: {
//         type: String,
//       },
//       image: {
//         type: Array,
//         default: [],
//       },
//       category: [
//         {
//           type: mongoose.Schema.ObjectId,
//           ref: "category",
//         },
//       ],
//       subCategory: [
//         {
//           type: mongoose.Schema.ObjectId,
//           ref: "subCategory",
//         },
//       ],
//       unit: {
//         type: String,
//         default: "",
//       },
//       stock: {
//         type: Number,
//         default: null,
//       },
//       price: {
//         type: Number,
//         default: null,
//       },
//       discount: {
//         type: Number,
//         default: null,
//       },
//       description: {
//         type: String,
//         default: "",
//       },
//       more_details: {
//         type: Object,
//         default: {},
//       },
//       public: {
//         type: Boolean,
//         default: true,
//       },
//     //   admin: {
//     //     type: mongoose.Schema.ObjectId,
//     //     ref: "admin",  // Assuming your admin model is named 'admin'
//     //     required: true,
//     //   },
//     },
//     {
//       timestamps: true,
//     }
//   );
  
//   // Index for text search
//   productSchema.index(
//     {
//       name: "text",
//       description: "text",
//     },
//     {
//       name: 10,
//       description: 5,
//     }
//   );
  
//   const ProductModel = mongoose.model("product", productSchema);
//   export default ProductModel;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: {},
    },
    public: {
      type: Boolean,
      default: true,
    },
      userId: {  
      type: mongoose.Schema.ObjectId,
      ref: "User",   
      required: true,
    },
      username: {
        type: String,
        ref: "User", 
       required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    name: 10,
    description: 5,
  }
);

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
