import { NextRequest, NextResponse } from 'next/server';

// CRITICAL FIX #3: Prevent Vercel caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY not configured, skipping welcome email');
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Email service not configured',
      });
    }

    // Dynamic import of Resend to handle optional dependency
    const { Resend } = require('resend');
    const resend = new Resend(resendApiKey);

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'MF Analyzer <onboarding@resend.dev>',
      to: email,
      subject: '🎉 Welcome to MF Analyzer!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 32px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
              .welcome-message { font-size: 18px; margin-bottom: 20px; }
              .features { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .features h2 { color: #667eea; margin-top: 0; }
              .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
              .feature-item:before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 18px; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to MF Analyzer!</h1>
              </div>
              <div class="content">
                <p class="welcome-message">Hi <strong>${name}</strong>,</p>
                
                <p>Thank you for joining <strong>MF Analyzer</strong> – India's premier platform for mutual fund analysis and investment planning! We're thrilled to have you on board.</p>
                
                <div class="features">
                  <h2>🚀 Here's what you can do now:</h2>
                  <div class="feature-item">Browse 2000+ mutual funds with real-time data</div>
                  <div class="feature-item">Compare funds side-by-side with detailed metrics</div>
                  <div class="feature-item">Track your watchlist and get price alerts</div>
                  <div class="feature-item">Plan your financial goals with our calculators</div>
                  <div class="feature-item">Get AI-powered investment insights</div>
                  <div class="feature-item">Manage your portfolio in one place</div>
                </div>

                <p style="text-align: center;">
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                  }" class="cta-button">
                    Start Exploring →
                  </a>
                </p>

                <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                  <strong>💡 Pro Tip:</strong> Start by building your watchlist! Add funds you're interested in and set up price alerts to never miss an opportunity.
                </p>

                <p>If you have any questions or need assistance, our support team is here to help.</p>

                <p>Happy Investing! 📈<br/>
                <strong>The MF Analyzer Team</strong></p>
              </div>
              <div class="footer">
                <p>This email was sent to ${email} because you created an account on MF Analyzer.</p>
                <p>&copy; ${new Date().getFullYear()} MF Analyzer. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return NextResponse.json(
        { error: 'Failed to send welcome email', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Welcome email sent successfully to:', email);
    return NextResponse.json({
      success: true,
      emailSent: true,
      emailId: data?.id,
    });
  } catch (error: any) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email', details: error.message },
      { status: 500 }
    );
  }
}
