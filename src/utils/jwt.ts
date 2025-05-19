import jwt from 'jsonwebtoken';
import { IUser } from '../modules/auth/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is not defined in environment variables');
}

export const generateAccessToken = (user: IUser): string => {
  const payload = {
    userId: user._id,
    // role: user.role // Bạn có thể thêm thông tin quyền (role) nếu cần
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: IUser): string => {
  const payload = {
    userId: user._id,
    // role: user.role // Thêm role vào refresh token nếu cần
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
