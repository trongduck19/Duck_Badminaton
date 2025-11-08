import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectCloudinary from './configs/cloudinary.js';
import connectDB from './configs/db.js';
import { stripeWebhooks } from './controllers/orderController.js';
import addressRouter from './routes/addressRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import productRouter from './routes/productRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();
//Alow multiple origin
const allowOrigin = ['http://localhost:5173','https://duck-badminaton.vercel.app'];

//Stripe Webhook
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
  }),
);

//Routes
app.get('/', (req, res) => res.send('API is Working'));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
