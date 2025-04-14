import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await authService.register(name, email, password);
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login(email, password);
  res.json({ accessToken, refreshToken, user });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken, userId } = req.body;
  const newAccessToken = await authService.refresh(userId, refreshToken);
  res.json({ accessToken: newAccessToken });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken, userId } = req.body;
  await authService.logout(userId, refreshToken);
  res.json({ message: 'Logged out' });
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  await authService.logoutAll(req.userId);
  res.json({ message: 'Logged out from all devices' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.json({ message: 'Reset email sent if account exists' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.json({ message: 'Password reset successfully' });
};
