import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/routes/auth.routes';
import { errorHandler, notFoundHandler } from '~/middlewares/error.middleware';
import { connectDB } from '~/config/database';
const app = express();
dotenv.config();
connectDB()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;