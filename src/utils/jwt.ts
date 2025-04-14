import jwt from 'jsonwebtoken';
import { IUser } from '../modules/auth/models/user.model';

export const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};