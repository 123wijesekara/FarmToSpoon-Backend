// import { request, response } from "express";
// import ProductModel from "../models/product.model.js";

// export const createProductController =async(request,response)=>{
// try{
// const {
//     name ,
//     image ,
//     category,
//     subCategory ,
//     unit ,
//     stock ,
//     price ,
//     discount,  
//     description,  
//     more_details,
// }=request.body  

// if(!name ||!image[0]|| !category[0]||!subCategory[0]|| !unit||!price||!description){
//     return response.status(400).json({
//         message:"Enter required fields",
//    error:true,
//    success:false
//     })
// }

// const product = new  ProductModel({
//     name ,
//     image ,
//     category,
//     subCategory ,
//     unit ,
//     stock ,
//     price ,
//     discount,  
//     description,  
//     more_details,
// })

// const saveProduct = await product.save()

// return response.json({
//     message:"Product created successfully",
//     data:saveProduct,
//     error:false,
//     success:true
// })
// } catch(error){
//     return response.status(500).json({
//         message :error.message || error,
//         error:true,
//         success :false
//     })
// }
// }

// export const getProductController = async(request,response)=>{
//     try{
   
//         let {page,limit,search}=request.body

//         if(!page){
//             page = 2
//         }
// if(!limit){
//     limit=10
// }

// const query = search ?{
// $text:{
//     $search : search
// }
// }:{}
// const skip =(page -1)* limit

//         const[data,totalCount]=await Promise.all([
//             ProductModel.find(query).sort({createdAt :-1}).skip(skip).limit(limit).populate('category subCategory'),
//             ProductModel.countDocuments(query)
//         ])

//         return response.json({
//             message:"Product data",
//             error:false,
//             success:true,
//             totlaCount: totalCount,
//             totalNoPage :Math.ceil(totalCount/limit),
//             data :data
//         })
//     }catch(error){
//         return response.status(500).json({
//             message:error.message || error,
//             error :true,
//             success :false
//         })
//     }
// }
 
  
// export const  getProductByCategory = async(request,response)=>{

//     try{
//         const { id } = request.body
//         if(!id){
           
//                 return response.status(400).json({
//                     message :"provide category id",
//                     error:true,
//                     success :false
//                 })
            
//         }
//         const product = await ProductModel.find({
//             category : {$in :id}
//         }).limit(15)
        
//         return response.json({
//             message :"category product list",
//             data:product,
//             error:false,
//             success:true
//         })

//     } catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

// export const getProductCategoryAndSubCategory = async(request,response)=>{
//     try{
//           const {categoryId,subCategoryId,page,limit}=request.body

//           if(!categoryId || !subCategoryId){

//             return response.status(400).json({
//                 message:"Provide categoryId and subcategorId",
//                 error:true,
//                 success:false
//             })
//           }

//           if(!page){
//             page =1
//           }

//           if(!limit){
//             limit =10
//           }

//           const query ={
//             category:{$in :categoryId},
//             subCategory :{$in :subCategoryId}
//           }

//           const skip =(page-1)*limit

//           const [data,dataCount] = await Promise.all([
//             ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit),
//             ProductModel.countDocuments(query)
//           ])

//           return response.json({
//             message :"Product list",
//             data: data, 
//             totalCount:dataCount,
//             page:page,
//             limit:limit,
//             success:true,
//             error:false
//           })
//     }catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }
// export const getProductDetails = async(request,response)=>{
//     try{
//         const {productId} = request.body

         

//         const product = await ProductModel.findOne({_id:productId})


//         return response.json({
//             message:"Product details",
//             data:product,
//             error:false,
//             success:true
//         })   
//     }catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

// export const updateProductDetails= async(request,response)=>{
//     try{
//         const{_id} =request.body
     

//         if(!_id){
//             return response.status(400).json({
//                 message:"Provide product id",
//                 error:true,
//                 success:false
//             })
//         }

//         const updateProduct = await ProductModel.updateOne({_id :_id},{
//          ...request.body
//         })

//         return response.json({
//             message:" updated successfully",
//             error:false,
//             success:true,
//             data:updateProduct,
//         })
//     }catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

// export const deleteProductDetails = async(request,response)=>{
//     try{
//         const{_id} =request.body
     

//         if(!_id){
//             return response.status(400).json({
//                 message:"Provide_id",
//                 error:true,
//                 success:false
//             })
//         }

//         const deleteProduct = await ProductModel.deleteOne({_id :_id})

//         return response.json({
//             message:" deleted successfully",
//             error:false,
//             success:true,
//             data:deleteProduct,
//         })
//     }catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

// export const searchProduct =async(request,response)=>{
//     try{
//         let {search,page,limit} = request.body
// if(!page){
//     page=1
// }
// if(!limit){
//     limit = 10
// }

// const query = search ?{
//     $text:{
//         $search :search
//     }
// }:{}

// const skip =(page-1)*limit
// const [data,dataCount] = await Promise.all([
//     ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit).populate('category subCategory'),

//     ProductModel.countDocuments(query)
// ])
// return response.json({

//     message:"Product data",
//     error:false,
//     success:true,
//     totalCount:dataCount,
//     totalPage:Math.ceil(dataCount/limit),
//     page:page,
//     limit:limit,
// })
     
//     }catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

import { request, response } from "express";
import ProductModel from "../models/product.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import CartProductModel from "../models/cartproduct.model.js";

export const createProductController = async (request, response) => {
    try {
      const {
        name,
        location,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
        userId, 
      } = request.body;
  
      if (!name || !location|| !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description || !userId) {
        return response.status(400).json({
          message: "Enter required fields",
          error: true,
          success: false,
        });
      }
  
      const product = new ProductModel({
        name,
        location,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
        userId, 
      });
  
      const saveProduct = await product.save();
  
      return response.json({
        message: "Product created successfully",
        data: saveProduct,
        error: false,
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };

//   export const getProductController = async (request, response) => {
//     try {
//       let { page, limit, search, userId } = request.body; // Get userId from request body
  
//       if (!page) {
//         page = 2;
//       }
//       if (!limit) {
//         limit = 10;
//       }
  
//       const query = search
//         ? {
//             $text: {
//               $search: search,
//             },
//             userId, // Filter by userId
//           }
//         : { userId }; // Filter by userId if no search term
  
//       const skip = (page - 1) * limit;
  
//       const [data, totalCount] = await Promise.all([
//         ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
//         ProductModel.countDocuments(query),
//       ]);
  
//       return response.json({
//         message: "Product data",
//         error: false,
//         success: true,
//         totalCount: totalCount,
//         totalNoPage: Math.ceil(totalCount / limit),
//         data: data,
//       });
//     } catch (error) {
//       return response.status(500).json({
//         message: error.message || error,
//         error: true,
//         success: false,
//       });
//     }
//   };
// export const getProductController = async (request, response) => {
//     try {
//       let { page, limit, search, userId } = request.body; // Get userId from request body
  
//       if (!page) {
//         page = 1; // Default to page 1 if not provided
//       }
//       if (!limit) {
//         limit = 10; // Default to limit 10 if not provided
//       }
  
//       // Ensure that userId is provided, if not, return error
//       if (!userId) {
//         return response.status(400).json({
//           message: "UserId is required to fetch products",
//           error: true,
//           success: false,
//         });
//       }
  
//       // Build query to filter products by userId and search term if provided
//       const query = search
//         ? {
//             $text: {
//               $search: search,
//             },
//             userId, // Filter by userId
//           }
//         : { userId }; // If no search, filter only by userId
  
//       const skip = (page - 1) * limit;
  
//       // Fetch data and totalCount simultaneously
//       const [data, totalCount] = await Promise.all([
//         ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
//         ProductModel.countDocuments(query),
//       ]);
  
//       return response.json({
//         message: "Product data",
//         error: false,
//         success: true,
//         totalCount: totalCount,
//         totalNoPage: Math.ceil(totalCount / limit),
//         data: data,
//       });
//     } catch (error) {
//       return response.status(500).json({
//         message: error.message || error,
//         error: true,
//         success: false,
//       });
//     }
//   };
  
export const getProductController = async (request, response) => {
    try {
      let { page, limit, search, userId } = request.body; // Get userId from request body
  
      if (!page) {
        page = 2;
      }
      if (!limit) {
        limit = 10;
      }
  
      const query = search
        ? {
            $text: {
              $search: search,
              
            },
          
            userId,  
          }
        : { userId }; // Filter by userId if no search term
  
      const skip = (page - 1) * limit;
  
      const [data, totalCount] = await Promise.all([
        ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
        ProductModel.countDocuments(query),
      ]);
  
      return response.json({
        message: "Product data",
        error: false,
        success: true,
        totalCount: totalCount,
        totalNoPage: Math.ceil(totalCount / limit),
        data: data,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
  
//   export const  getProductByCategory = async(request,response)=>{

//     try{
//         const { id } = request.body
//         if(!id){
           
//                 return response.status(400).json({
//                     message :"provide category id",
//                     error:true,
//                     success :false
//                 })
            
//         }
//         const product = await ProductModel.find({
//             category : {$in :id}
//         }).limit(15)
        
//         return response.json({
//             message :"category product list",
//             data:product,
//             error:false,
//             success:true
//         })

//     } catch(error){
//         return response.status(500).json({
//             message :error.message || error,
//             error:true,
//             success :false
//         })
//     }
// }

// export const getProductByCategory = async (request, response) => {
//   try {
//     const { id, sortBy, sortOrder, district } = request.body;

//     if (!id) {
//       return response.status(400).json({
//         message: "Provide category id",
//         error: true,
//         success: false
//       });
//     }

//     let sortOptions = {};
//     if (sortBy === 'price') {
//       sortOptions.price = sortOrder === 'asc' ? 1 : -1;
//     } else if (sortBy === 'district') {
//       sortOptions.district = sortOrder === 'asc' ? 1 : -1;
//     }

//     const query = {
//       category: { $in: id }
//     };

//     if (district) {
//       query.district = district;
//     }

//     const product = await ProductModel.find(query)
//       .sort(sortOptions)
//       .limit(15);

//     return response.json({
//       message: "Category product list",
//       data: product,
//       error: false,
//       success: true
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     });
//   }
// };

// export const getProductByCategory = async (request, response) => {
//   try {
//     const { id, sortBy, sortOrder, district, searchTerm } = request.body;

//     if (!id) {
//       return response.status(400).json({
//         message: "Provide category id",
//         error: true,
//         success: false,
//       });
//     }

//     let sortOptions = {};
//     if (sortBy === 'price') {
//       sortOptions.price = sortOrder === 'asc' ? 1 : -1;
//     } else if (sortBy === 'district' || sortBy === 'location') {
//       sortOptions.location = sortOrder === 'asc' ? 1 : -1;
//     }

//     // Build query object
//     const query = {
//       category: { $in: id },
//     };

//     if (district) {
//       query.location = district; // adjust if your field is named differently
//     }

//     if (searchTerm && searchTerm.trim() !== '') {
//       // Use case-insensitive regex for matching product name or other fields
//       query.name = { $regex: searchTerm.trim(), $options: 'i' };
//     }

//     const product = await ProductModel.find(query)
//       .sort(sortOptions)
//       .limit(15);

//     return response.json({
//       message: "Category product list",
//       data: product,
//       error: false,
//       success: true,
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

 

export const getProductByCategory = async (request, response) => {
  try {
    const { id, sortBy, sortOrder, district, searchTerm } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }

    // Step 1: Build base query
    
    const query = {
      category: { $in: id },
    };

    if (district) {
      query.location = district;
    }

    if (searchTerm && searchTerm.trim() !== "") {
      query.name = { $regex: searchTerm.trim(), $options: "i" };
    }

    // Step 2: Fetch products matching the query
    let products = await ProductModel.find(query);

    // Step 3: Fetch cart quantities grouped by user and product
    const cartItems = await CartProductModel.aggregate([
      {
        $group: {
          _id: { productId: "$productId", userId: "$userId" },
          totalQty: { $sum: "$quantity" }
        }
      }
    ]);
    // console.log("Cart Items Aggregated:", JSON.stringify(cartItems, null, 2));
    // Step 4: Prepare a Set of productIds to exclude
    const excludeProductIds = new Set();

    for (const product of products) {
      const productIdStr = product._id.toString();

      for (const cartItem of cartItems) {
        const cartProductIdStr = cartItem._id.productId.toString();

           // Changed logic: only exclude if product stock is 0
        if (productIdStr === cartProductIdStr && product.stock <= 0) {
          excludeProductIds.add(productIdStr);
          break;
        }
      }
    }

    // Step 5: Filter products
    products = products.filter(
      (product) => !excludeProductIds.has(product._id.toString()) && product.stock > 0
    );

    // Step 6: Sort
    let sortOptions = {};
    if (sortBy === "price") {
      sortOptions.price = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "district" || sortBy === "location") {
      sortOptions.location = sortOrder === "asc" ? 1 : -1;
    }

    if (Object.keys(sortOptions).length > 0) {
      products = products.sort((a, b) => {
        const key = Object.keys(sortOptions)[0];
        const order = sortOptions[key];
        return order * ((a[key] || 0) - (b[key] || 0));
      });
    }

    // Step 7: Limit to 15
    products = products.slice(0, 15);

    return response.json({
      message: "Category product list",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error in getProductByCategory:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const getProductCategoryAndSubCategory = async(request,response)=>{
    try{
          const {categoryId,subCategoryId,page,limit}=request.body

          if(!categoryId || !subCategoryId){

            return response.status(400).json({
                message:"Provide categoryId and subcategorId",
                error:true,
                success:false
            })
          }

          if(!page){
            page =1
          }

          if(!limit){
            limit =10
          }

          const query ={
            category:{$in :categoryId},
            subCategory :{$in :subCategoryId}
          }

          const skip =(page-1)*limit

          const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
          ])

          return response.json({
            message :"Product list",
            data: data, 
            totalCount:dataCount,
            page:page,
            limit:limit,
            success:true,
            error:false
          })
    }catch(error){
        return response.status(500).json({
            message :error.message || error,
            error:true,
            success :false
        })
    }
}
// export const getProductDetails = async (request, response) => {
//     try {
//       const { productId, userId } = request.body; // Add userId to the request body
  
//       if (!productId || !userId) {
//         return response.status(400).json({
//           message: "ProductId and userId are required",
//           error: true,
//           success: false,
//         });
//       }
  
//       const product = await ProductModel.findOne({ _id: productId, userId }); // Filter by userId
  
//       if (!product) {
//         return response.status(404).json({
//           message: "Product not found or you don't have permission to view it",
//           error: true,
//           success: false,
//         });
//       }
  
//       return response.json({
//         message: "Product details",
//         data: product,
//         error: false,
//         success: true,
//       });
//     } catch (error) {
//       return response.status(500).json({
//         message: error.message || error,
//         error: true,
//         success: false,
//       });
//     }
//   };
export const getProductDetails = async (request, response) => {
  try {
    const { productId, userId } = request.body; // Add userId to the request body

    console.log("Received Product ID:", productId);
    console.log("Received User ID:", userId);

    // Check if productId and userId are provided
    if (!productId || !userId) {
      return response.status(400).json({
        message: "ProductId and userId are required",
        error: true,
        success: false,
      });
    }

   
    const product = await ProductModel.findOne({ _id: productId, _id:userId });  

    // Check if product is found
    if (!product) {
      return response.status(404).json({
        message: "Product not found or you don't have permission to view it",
        error: true,
        success: false,
      });
    }

    // Send product details as response
    return response.json({
      message: "Product details fetched successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

  export const updateProductDetails = async (request, response) => {
    try {
      const { _id, userId } = request.body;
      console.log("userId",userId)
      if (!_id || !userId) {
        return response.status(400).json({
          message: "Provide product id and userId",
          error: true,
          success: false,
        });
      }
  
      const product = await ProductModel.findOne({ _id, userId }); 
  
      if (!product) {
        return response.status(404).json({
          message: "Product not found or you don't have permission to update it",
          error: true,
          success: false,
        });
      }
  
      const updateProduct = await ProductModel.updateOne({ _id }, {
        ...request.body,
      });
  
      return response.json({
        message: "Product updated successfully",
        error: false,
        success: true,
        data: updateProduct,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
  
  export const deleteProductDetails = async (request, response) => {
    try {
      const { _id, userId } = request.body;
  
      if (!_id || !userId) {
        return response.status(400).json({
          message: "Provide product id and userId",
          error: true,
          success: false,
        });
      }
  
      const product = await ProductModel.findOne({ _id, userId });  
  
      if (!product) {
        return response.status(404).json({
          message: "Product not found or you don't have permission to delete it",
          error: true,
          success: false,
        });
      }
  
      const deleteProduct = await ProductModel.deleteOne({ _id });
  
      return response.json({
        message: "Product deleted successfully",
        error: false,
        success: true,
        data: deleteProduct,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
  export const searchProduct = async(request, response) => {
    try {
        let { search, page = 1, limit = 10 } = request.body;

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
                // Add other fields you want to search
            ]
        } : {};

        const skip = (page - 1) * limit;
        
        const [products, dataCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments(query)
        ]);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            data: products,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit
        });
         
    } catch(error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export const getAllProducts = async (req, res) => {
  try {
    const { userId } = req.body;  
 
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Provide userId",
      });
    }

    // Find products related to userId
    const products = await ProductModel.find({ userId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .lean();

    const mapped = products.map(product => ({
      _id: product._id,
      name: product.name,
      image: product.image,
      stock: product.stock,
      availableStock: product.stock,
      isOutOfStock: product.stock === 0,
      category: product.category,
      subCategory: product.subCategory,
      location: product.location || "",
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.error("getAllProducts error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
