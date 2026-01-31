import { Router } from 'express';
import {
  register,
  login,
  refreshTokens,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from '../controllers/auth';
import {
  redirectToGoogle,
  handleGoogleCallback,
  verifyGoogleToken,
} from '../controllers/googleAuth';

const router = Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokens);

// Email Verification
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Google OAuth - ID Token verification (for @react-oauth/google)
// IMPORTANT: POST route must come before GET to avoid route conflicts
router.post('/google', verifyGoogleToken);

// Google OAuth - Redirect flow (for direct backend redirect)
router.get('/google', redirectToGoogle);
router.get('/google/callback', handleGoogleCallback);

export default router;
