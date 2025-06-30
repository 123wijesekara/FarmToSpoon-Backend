import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http';
// Your class
dotenv.config();

import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import WebSocketServer from './utils/websocketServer.js';

const app = express();
const server = http.createServer(app);

//  Setup WebSocket Server
const wsServer = new WebSocketServer(server);

//  Provide WebSocket access in routes/controllers
app.locals.wss = {
  sendToUser: wsServer.sendToUser.bind(wsServer),
  broadcast: wsServer.broadcast.bind(wsServer)
};

//  Middleware
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// Routes
app.get("/", (req, res) => res.json({ message: "Server is running" }));
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

//  Database
connectDB();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` WebSocket server running on ws://localhost:${PORT}`);
});
