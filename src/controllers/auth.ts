import 'dotenv/config'; // Load environment variables first!
import { Request, Response } from 'express';
import { z } from 'zod';
import { mongodb } from '../db/mongodb';
import { User, RefreshToken } from '../types/mongodb';
import { ObjectId } from 'mongodb';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/auth';
import { formatResponse } from '../utils/response';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  generateOTP,
  generateToken,
} from '../utils/email';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  age: z.number().min(18).max(100).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const usersCollection = mongodb.getCollection<User>('users');
    const existingUser = await usersCollection.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      res.status(409).json({
        error: 'User already exists with this email',
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const newUser: User = {
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      ...(validatedData.age && { age: validatedData.age }),
      ...(validatedData.riskLevel && { riskLevel: validatedData.riskLevel }),
      role: 'USER',
      isVerified: false,
      kycStatus: 'PENDING',
      provider: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId.toString();

    // Generate OTP for email verification
    const otp = generateOTP();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification token
    const verificationTokensCollection = mongodb.getCollection(
      'email_verification_tokens'
    );
    await verificationTokensCollection.insertOne({
      email: validatedData.email,
      token,
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send verification email
    try {
      await sendVerificationEmail(validatedData.email, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    const user = {
      id: userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
    };

    // Generate tokens
    const accessToken = generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ id: userId });

    // Store refresh token
    const refreshTokensCollection =
      mongodb.getCollection<RefreshToken>('refresh_tokens');
    await refreshTokensCollection.insertOne({
      token: refreshToken,
      userId: result.insertedId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    });

    res.status(201).json(
      formatResponse(
        {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
          message: 'Registration successful. Please verify your email.',
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res
        .status(500)
        .json(formatResponse(null, 'An error occurred during registration'));
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const usersCollection = mongodb.getCollection<User>('users');
    const user = await usersCollection.findOne({
      email: validatedData.email,
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userId = user._id!.toString();

    // Generate tokens
    const accessToken = generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ id: userId });

    // Store refresh token
    const refreshTokensCollection =
      mongodb.getCollection<RefreshToken>('refresh_tokens');
    await refreshTokensCollection.insertOne({
      token: refreshToken,
      userId: user._id!,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    });

    res.json(
      formatResponse(
        {
          user: {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        'Login successful'
      )
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const refreshTokensCollection =
      mongodb.getCollection<RefreshToken>('refresh_tokens');
    const storedToken = await refreshTokensCollection.findOne({
      token: refreshToken,
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res
        .status(401)
        .json({ error: 'Invalid or expired refresh token' });
    }

    // Get user
    const usersCollection = mongodb.getCollection<User>('users');
    const user = await usersCollection.findOne({
      _id: storedToken.userId,
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userId = user._id!.toString();

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      id: userId,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({ id: userId });

    // Update refresh token
    await refreshTokensCollection.updateOne(
      { _id: storedToken._id },
      {
        $set: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      }
    );

    return res.json(
      formatResponse(
        {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        },
        'Tokens refreshed successfully'
      )
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Token refresh error:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Check if user exists
    const usersCollection = mongodb.getCollection<User>('users');
    const user = await usersCollection.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json(
        formatResponse(
          { message: 'If the email exists, a reset code has been sent' },
          'Password reset initiated'
        )
      );
      return;
    }

    // Generate OTP and token
    const otp = generateOTP();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store reset token
    const resetTokensCollection = mongodb.getCollection(
      'password_reset_tokens'
    );

    // Delete any existing reset tokens for this email
    await resetTokensCollection.deleteMany({ email });

    await resetTokensCollection.insertOne({
      email,
      token,
      otp,
      expiresAt,
      used: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send reset email
    try {
      const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5001'}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
      await sendPasswordResetEmail(email, otp, resetLink);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json(formatResponse(null, 'Failed to send reset email'));
      return;
    }

    res.json(
      formatResponse(
        { message: 'Password reset code sent to your email' },
        'Password reset initiated'
      )
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res.status(500).json(formatResponse(null, 'An error occurred'));
    }
  }
};

export const verifyResetOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);

    const resetTokensCollection = mongodb.getCollection(
      'password_reset_tokens'
    );

    const resetToken = await resetTokensCollection.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      res.status(400).json(formatResponse(null, 'Invalid or expired OTP'));
      return;
    }

    res.json(
      formatResponse(
        { token: resetToken.token, message: 'OTP verified successfully' },
        'OTP verified'
      )
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res.status(500).json(formatResponse(null, 'An error occurred'));
    }
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);

    const resetTokensCollection = mongodb.getCollection(
      'password_reset_tokens'
    );

    const resetToken = await resetTokensCollection.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      res.status(400).json(formatResponse(null, 'Invalid or expired OTP'));
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    const usersCollection = mongodb.getCollection<User>('users');
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    // Mark token as used
    await resetTokensCollection.updateOne(
      { _id: resetToken._id },
      { $set: { used: true, updatedAt: new Date() } }
    );

    // Invalidate all refresh tokens for this user
    const user = await usersCollection.findOne({ email });
    if (user) {
      const refreshTokensCollection =
        mongodb.getCollection<RefreshToken>('refresh_tokens');
      await refreshTokensCollection.deleteMany({ userId: user._id });
    }

    res.json(
      formatResponse(
        { message: 'Password reset successfully' },
        'Password reset successful'
      )
    );
  } catch (error) {
    console.error('Reset password error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res.status(500).json(formatResponse(null, 'An error occurred'));
    }
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);

    const verificationTokensCollection = mongodb.getCollection(
      'email_verification_tokens'
    );

    const verificationToken = await verificationTokensCollection.findOne({
      email,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!verificationToken) {
      res
        .status(400)
        .json(formatResponse(null, 'Invalid or expired verification code'));
      return;
    }

    // Update user verification status
    const usersCollection = mongodb.getCollection<User>('users');
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
      }
    );

    // Mark token as verified
    await verificationTokensCollection.updateOne(
      { _id: verificationToken._id },
      { $set: { verified: true, updatedAt: new Date() } }
    );

    // Get updated user
    const user = await usersCollection.findOne({ email });

    if (user) {
      // Send welcome email
      try {
        await sendWelcomeEmail(email, user.name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    res.json(
      formatResponse(
        { message: 'Email verified successfully', isVerified: true },
        'Email verification successful'
      )
    );
  } catch (error) {
    console.error('Verify email error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res.status(500).json(formatResponse(null, 'An error occurred'));
    }
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const usersCollection = mongodb.getCollection<User>('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      res.status(404).json(formatResponse(null, 'User not found'));
      return;
    }

    if (user.isVerified) {
      res.status(400).json(formatResponse(null, 'Email already verified'));
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const verificationTokensCollection = mongodb.getCollection(
      'email_verification_tokens'
    );

    // Delete old tokens
    await verificationTokensCollection.deleteMany({ email });

    // Create new token
    await verificationTokensCollection.insertOne({
      email,
      token,
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res
        .status(500)
        .json(formatResponse(null, 'Failed to send verification email'));
      return;
    }

    res.json(
      formatResponse(
        { message: 'Verification email sent' },
        'Verification email sent successfully'
      )
    );
  } catch (error) {
    console.error('Resend verification email error:', error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(formatResponse(null, 'Validation failed', error.errors));
    } else {
      res.status(500).json(formatResponse(null, 'An error occurred'));
    }
  }
};
