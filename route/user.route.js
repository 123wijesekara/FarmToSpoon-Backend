import {Router} from 'express'
import { deleteBuyer, deleteFarmer, forgotPasswordController, getAllBuyerController, getAllFarmersController, getBuyerById, getFarmerById, loginController, logoutController, refreshToken, registerUserController, resetpassword, suspendBuyer, suspendFarmer, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter =Router()
userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)
userRouter.get("/get-all-farmers", getAllFarmersController);
userRouter.post("/farmer/:id", getFarmerById);
userRouter.delete("/farmer/:id", deleteFarmer);
userRouter.patch("/farmer/suspend/:id", suspendFarmer);
 
userRouter.get("/get-all-buyers", getAllBuyerController);
userRouter.post("/buyer/:id", getBuyerById);
userRouter.delete("/buyer/:id", deleteBuyer);
userRouter.patch("/buyer/suspend/:id", suspendBuyer);

export default userRouter