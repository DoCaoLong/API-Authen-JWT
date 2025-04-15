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
  disable2FA
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login-with-captcha', loginWithCaptcha);
router.post('/verify-otp', verifyOTP);
router.post('/enable-2fa', enable2FA);
router.post('/disable-2fa', disable2FA);
export default router;