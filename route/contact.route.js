import{Router} from 'express'
 
 
import { contactFormHandler } from '../controllers/contactform.controller.js';
 

const Contactrouter = Router();

 
Contactrouter.post("/", contactFormHandler);

export default Contactrouter;
