// import{Router} from 'express'
// import auth from '../middleware/auth.js'
// import { createProductController, deleteProductDetails, getProductByCategory, getProductCategoryAndSubCategory, getProductController, getProductDetails,searchProduct,updateProductDetails } from '../controllers/product.controller.js'
// import { admin } from '../middleware/Admin.js'

// const productRouter =Router()

// productRouter.post("/create",auth,admin,createProductController)
// productRouter.post("/get",getProductController)
// productRouter.post("/get-product-by-category",getProductByCategory)
// productRouter.post('/get-product-by-category-and-subcategory',getProductCategoryAndSubCategory)
// productRouter.post('/get-product-details',getProductDetails)
// productRouter.put('/update-product-details',auth,admin,updateProductDetails)
// productRouter.delete('/delete-product',auth,admin,deleteProductDetails)
// productRouter.post('/search-product',searchProduct)

// export default productRouter
import{Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductCategoryAndSubCategory, getProductController, getProductDetails,searchProduct,updateProductDetails } from '../controllers/product.controller.js'
import { farmer } from '../middleware/Farmer.js'

const productRouter =Router()

productRouter.post("/create",auth,farmer,createProductController)
productRouter.post("/get",auth,farmer,getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.put('/update-product-details',auth,farmer,updateProductDetails)
productRouter.delete('/delete-product',auth,farmer,deleteProductDetails)
productRouter.post('/search-product',searchProduct)

export default productRouter
