import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
dotenv.config()
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import upload from './middleware/multer.js'
import uploadRouter from './route/upload.route.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import http from 'http';
import { Server } from 'socket.io';
import ratingRouter from './route/Rating.route.js'
import Salesrouter from './route/sales.route.js'
import Contactrouter from './route/contact.route.js'

const app = express()
const server = http.createServer(app);



const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });


app.use(cors({
    creadentials :true,
origin:process.env.FRONTEND_URL|| "http://localhost:5173",
credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const PORT =8080 || process.env.PORT


app.use((req, res, next) => {
    req.io = io;
    next();
  });

app.get("/",(request,response)=>{
    response.json({
        message:"Server is running"
    })
})
app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)
app.use("/api/ratings",ratingRouter)
app.use('/api/report',Salesrouter)
app.use('/api/contact',Contactrouter)
connectDB()




io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);
   
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });
   
    socket.on('disconnect', () => {
      console.log("Client disconnected:", socket.id);
    });
  });


app.listen(PORT,()=>{
    console.log("Server is running",PORT)
})