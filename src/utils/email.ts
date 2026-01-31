import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@mutualfunds.in';

export async function sendPasswordResetEmail(
  email: string,
  otp: string,
  resetLink?: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - Mutual Funds Portal',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px;">Hello,</p>
              
              <p style="font-size: 16px;">We received a request to reset your password for your Mutual Funds Portal account.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your One-Time Password (OTP) is:</p>
                <h2 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 15px 0;">${otp}</h2>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">This OTP will expire in 10 minutes</p>
              </div>
              
              ${
                resetLink
                  ? `
              <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
              </div>
              `
                  : ''
              }
              
              <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated email. Please do not reply to this message.<br>
                © ${new Date().getFullYear()} Mutual Funds Portal. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendVerificationEmail(
  email: string,
  otp: string,
  verifyLink?: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify Your Email - Mutual Funds Portal',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Mutual Funds Portal!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px;">Hello,</p>
              
              <p style="font-size: 16px;">Thank you for signing up! Please verify your email address to complete your registration.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your verification code is:</p>
                <h2 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 15px 0;">${otp}</h2>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">This code will expire in 10 minutes</p>
              </div>
              
              ${
                verifyLink
                  ? `
              <div style="text-align: center; margin: 25px 0;">
                <a href="${verifyLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
              </div>
              `
                  : ''
              }
              
              <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated email. Please do not reply to this message.<br>
                © ${new Date().getFullYear()} Mutual Funds Portal. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Mutual Funds Portal!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome, ${name}!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px;">Hello ${name},</p>
              
              <p style="font-size: 16px;">Your account has been successfully verified! Welcome to Mutual Funds Portal.</p>
              
              <p style="font-size: 16px;">Here's what you can do next:</p>
              
              <ul style="font-size: 14px; color: #666;">
                <li>Explore top-performing mutual funds</li>
                <li>Build your investment portfolio</li>
                <li>Set up personalized alerts</li>
                <li>Track your investments in real-time</li>
                <li>Complete your KYC for seamless investing</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5001'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                Need help? Contact us at ${process.env.ADMIN_EMAIL || 'support@mutualfunds.in'}<br>
                © ${new Date().getFullYear()} Mutual Funds Portal. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error for welcome email, it's not critical
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
