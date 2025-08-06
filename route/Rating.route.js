import {Router} from 'express';
import auth from '../middleware/auth.js';
import { getratings, rating } from '../controllers/rating.controller.js';
 

const ratingRouter = Router()


ratingRouter.post("/ratings",rating)
 
ratingRouter.get("/ratings/${itemId}",getratings)
 
 

export default ratingRouter