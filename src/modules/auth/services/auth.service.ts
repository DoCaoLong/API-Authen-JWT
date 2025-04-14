import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt';
import userRepository from '../repositories/user.repository';
import { sendResetPasswordEmail } from '../../../utils/mailer';

class AuthService {
  async register(name: string, email: string, password: string): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await userRepository.create({ name, email, password: hashedPassword });
    } catch (err) {
      throw new Error('Registration failed: ' + (err as Error).message);
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await userRepository.addRefreshToken(user._id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async refresh(userId: string, refreshToken: string): Promise<string> {
    try {
      const user = await userRepository.findById(userId);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        throw new Error('Invalid refresh token');
      }
      return generateAccessToken(user);
    } catch (err) {
      throw new Error('Token refresh failed: ' + (err as Error).message);
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      await userRepository.removeRefreshToken(userId, refreshToken);
    } catch (err) {
      throw new Error('Logout failed: ' + (err as Error).message);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      await userRepository.clearAllRefreshTokens(userId);
    } catch (err) {
      throw new Error('Logout all failed: ' + (err as Error).message);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) return;
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      await sendResetPasswordEmail(user.email, token);
    } catch (err) {
      throw new Error('Forgot password failed: ' + (err as Error).message);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await userRepository.findById(decoded.userId);
      if (!user) throw new Error('User not found');
      user.password = await bcrypt.hash(newPassword, 10);
      user.refreshTokens = [];
      await user.save();
    } catch (err) {
      throw new Error('Reset password failed: ' + (err as Error).message);
    }
  }
}

export default new AuthService();
