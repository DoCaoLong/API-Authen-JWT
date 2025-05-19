import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyOTP,
  loginWithCaptcha,
  enable2FA,
  disable2FA,
  verifyAccountFromToken
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/login-with-captcha', loginWithCaptcha);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-otp', verifyOTP);
router.get('/verify-account', verifyAccountFromToken);

// Protected routes (cần đăng nhập)
router.post('/refresh', authenticate, refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/enable-2fa', authenticate, enable2FA);
router.post('/disable-2fa', authenticate, disable2FA);

export default router;
