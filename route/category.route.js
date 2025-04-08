import{Router} from 'express'
import auth from '../middleware/auth.js'
import { AddCatergoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'


const categoryRouter =Router()

categoryRouter.post("/add-category",auth,AddCatergoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete('/delete',auth,deleteCategoryController)

export default categoryRouter