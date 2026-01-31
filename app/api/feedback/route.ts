import { NextRequest, NextResponse } from 'next/server';

// CRITICAL FIX #3: Prevent Vercel caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Make Resend optional to avoid build errors
let Resend: any;
let resend: any = null;

try {
  const ResendModule = require('resend');
  Resend = ResendModule.Resend;
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn(
    '⚠️  Resend module not available. Email sending will be disabled.'
  );
}

export async function POST(request: NextRequest) {
  try {
    const { feedbackType, rating, name, email, message, userId } =
      await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback message is required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const userName = name && name !== 'Anonymous' ? name : 'Anonymous User';
    const userEmail = email || 'Not provided';

    // Construct email content
    const emailSubject = `Feedback: ${
      feedbackType
        ? feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)
        : 'General'
    }`;
    const emailBody = `
New Feedback Received

Type: ${feedbackType || 'general'}
Rating: ${rating || 'N/A'}/5
Name: ${userName}
Email: ${userEmail}
User ID: ${userId || 'N/A'}
Timestamp: ${timestamp}

Message:
${message.trim()}
    `.trim();

    // Try to send email using Resend
    if (resend && process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'MF Analyzer Feedback <onboarding@resend.dev>', // Use Resend's test domain or your verified domain
          to: ['rakeshd01042024@gmail.com'],
          subject: emailSubject,
          text: emailBody,
          replyTo: userEmail !== 'Not provided' ? userEmail : undefined,
        });

        if (error) {
          console.error('❌ Resend error:', error);
          // Don't throw, just log and continue
        } else {
          console.log('✅ Feedback email sent successfully via Resend:', data);

          return NextResponse.json({
            success: true,
            message: 'Feedback sent successfully to rakeshd01042024@gmail.com',
            emailSent: true,
          });
        }
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Fall through to return success with warning
      }
    }

    // If email sending failed or RESEND_API_KEY not configured, still log and return success
    console.log('📧 Feedback received (email not sent):');
    console.log('Type:', feedbackType || 'general');
    console.log('Rating:', rating || 'N/A');
    console.log('From:', userName);
    console.log('Email:', userEmail);
    console.log('Message:', message);

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
      emailSent: false,
      warning:
        'Email service not configured. Please set RESEND_API_KEY environment variable.',
    });
  } catch (error) {
    console.error('❌ Error processing feedback:', error);
    return NextResponse.json(
      {
        error: 'Failed to process feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
