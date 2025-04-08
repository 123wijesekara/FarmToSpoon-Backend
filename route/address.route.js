import {Router} from 'express';
import { addAddressController, deleteAddressController, getAddressController, updateAdddressController } from '../controllers/address.controller.js';
import auth from '../middleware/auth.js';

const addressRouter = Router()

addressRouter.post('/create',auth,addAddressController)
addressRouter.get('/get',auth,getAddressController)
addressRouter.put('/update',auth,updateAdddressController)
addressRouter.delete('/delete',auth,deleteAddressController)

export default addressRouter