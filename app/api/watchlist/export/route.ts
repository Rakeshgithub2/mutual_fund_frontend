import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CRITICAL FIX #3: Prevent Vercel caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// POST /api/watchlist/export - Send watchlist to user's email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, watchlist } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    // Get fund details for watchlist
    const funds = await prisma.fund.findMany({
      where: {
        id: { in: watchlist },
      },
      select: {
        name: true,
        amfiCode: true,
        category: true,
        type: true,
      },
    });

    // Check if Resend is available
    let Resend: any;
    let resend: any = null;
    try {
      const ResendModule = require('resend');
      Resend = ResendModule.Resend;
      if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
      }
    } catch (error) {
      console.warn('Resend module not available');
    }

    let emailSent = false;
    let warning = '';

    if (resend && process.env.RESEND_API_KEY) {
      try {
        // Create HTML table for funds
        const fundsHtml =
          funds.length > 0
            ? `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Fund Name</th>
                  <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Category</th>
                  <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Type</th>
                </tr>
              </thead>
              <tbody>
                ${funds
                  .map(
                    (fund) => `
                  <tr>
                    <td style="border: 1px solid #e5e7eb; padding: 12px;">${fund.name}</td>
                    <td style="border: 1px solid #e5e7eb; padding: 12px;">${fund.category}</td>
                    <td style="border: 1px solid #e5e7eb; padding: 12px;">${fund.type}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
            : '<p>Your watchlist is empty.</p>';

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Your Watchlist Export</h2>
            <p>Hello ${user.name || 'there'},</p>
            <p>Here is your current watchlist with <strong>${
              funds.length
            }</strong> fund(s):</p>
            ${fundsHtml}
            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              Exported on: ${new Date().toLocaleString()}
            </p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated email from MF Analyzer. Please do not reply to this email.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: 'MF Analyzer <onboarding@resend.dev>',
          to: [user.email],
          subject: 'Your Watchlist Export - MF Analyzer',
          html: htmlContent,
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Error sending email via Resend:', emailError);
        warning = 'Email sending failed';
      }
    } else {
      warning =
        'Email not configured. Set RESEND_API_KEY environment variable to enable email notifications.';
      console.log('Watchlist export would be sent to:', user.email);
      console.log('Watchlist:', JSON.stringify(funds, null, 2));
    }

    return NextResponse.json({
      success: true,
      emailSent,
      warning: warning || undefined,
      message: emailSent
        ? `Watchlist sent to ${user.email}`
        : 'Email not configured',
    });
  } catch (error) {
    console.error('Error exporting watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to export watchlist' },
      { status: 500 }
    );
  }
}
