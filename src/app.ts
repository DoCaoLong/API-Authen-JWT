import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import authRoutes from './modules/auth/routes/auth.routes';
import { notFoundHandler } from './modules/auth/middlewares/error.middleware';
import { errorHandler } from './modules/auth/middlewares/error.middleware';
import { connectDB } from './config/database'
const app = express();
dotenv.config();
connectDB()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use(errorHandler);
app.use(notFoundHandler);
export default app;