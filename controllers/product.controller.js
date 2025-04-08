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
        userId, // Add userId to the request body
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
        userId, // Save userId with the product
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
            userId, // Filter by userId
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
  
  export const  getProductByCategory = async(request,response)=>{

    try{
        const { id } = request.body
        if(!id){
           
                return response.status(400).json({
                    message :"provide category id",
                    error:true,
                    success :false
                })
            
        }
        const product = await ProductModel.find({
            category : {$in :id}
        }).limit(15)
        
        return response.json({
            message :"category product list",
            data:product,
            error:false,
            success:true
        })

    } catch(error){
        return response.status(500).json({
            message :error.message || error,
            error:true,
            success :false
        })
    }
}

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

    // Find the product by productId and userId
    const product = await ProductModel.findOne({ _id: productId, _id:userId }); // Filter by userId

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
  
      if (!_id || !userId) {
        return response.status(400).json({
          message: "Provide product id and userId",
          error: true,
          success: false,
        });
      }
  
      const product = await ProductModel.findOne({ _id, userId }); // Ensure the userId matches
  
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
  
      const product = await ProductModel.findOne({ _id, userId }); // Ensure the userId matches
  
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
  export const searchProduct =async(request,response)=>{
    try{
        let {search,page,limit} = request.body
if(!page){
    page=1
}
if(!limit){
    limit = 10
}

const query = search ?{
    $text:{
        $search :search
    }
}:{}

const skip =(page-1)*limit
const [data,dataCount] = await Promise.all([
    ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit).populate('category subCategory'),

    ProductModel.countDocuments(query)
])
return response.json({

    message:"Product data",
    error:false,
    success:true,
    totalCount:dataCount,
    totalPage:Math.ceil(dataCount/limit),
    page:page,
    limit:limit,
})
     
    }catch(error){
        return response.status(500).json({
            message :error.message || error,
            error:true,
            success :false
        })
    }
}
      
  
