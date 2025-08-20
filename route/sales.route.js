 import{Router} from 'express'
import express from "express";
import { getSalesReport } from '../controllers/sales.controller.js';
 

const Salesrouter = express.Router();

 
Salesrouter.post("/sales", getSalesReport);

export default Salesrouter;
