import { Resend } from 'resend';
import Handlebars from 'handlebars';

interface FeedbackEmailData {
  feedbackType: string;
  rating: number;
  name: string;
  email: string | null;
  message: string;
  userId: string | null;
  submittedAt: Date;
}

export class FeedbackEmailService {
  private resend: Resend;
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        '⚠️ RESEND_API_KEY is not configured. Feedback emails will not be sent.'
      );
      this.resend = null as any;
    } else {
      this.resend = new Resend(apiKey);
    }

    this.fromEmail = process.env.FROM_EMAIL || 'noreply@mutualfunds.com';
    this.adminEmail = 'rakeshd01042024@gmail.com';
  }

  /**
   * Send feedback notification to admin
   */
  async sendFeedbackNotification(
    data: FeedbackEmailData
  ): Promise<{ success: boolean; error?: string }> {
    // Skip if Resend is not configured
    if (!this.resend) {
      console.log(
        '📧 Email service not configured. Skipping feedback notification.'
      );
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    try {
      const template = this.getFeedbackNotificationTemplate(data);
      const html = template.html;

      // Format FROM field to show user's name with verified email
      // Example: "John Doe <noreply@mutualfunds.in>"
      const fromField = data.email
        ? `${data.name} via MutualFunds <${this.fromEmail}>`
        : this.fromEmail;

      const result = await this.resend.emails.send({
        from: fromField,
        to: this.adminEmail,
        replyTo: data.email || undefined, // Admin can reply directly to user's email
        subject: template.subject,
        html,
      });

      console.log(
        `✅ Feedback notification sent to ${this.adminEmail}:`,
        result.data?.id
      );
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to send feedback notification:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get feedback notification email template
   */
  private getFeedbackNotificationTemplate(data: FeedbackEmailData): {
    subject: string;
    html: string;
  } {
    const typeEmoji =
      {
        bug: '🐛',
        feature: '✨',
        general: '💬',
      }[data.feedbackType] || '💬';

    const typeLabel =
      {
        bug: 'Bug Report',
        feature: 'Feature Request',
        general: 'General Feedback',
      }[data.feedbackType] || 'General Feedback';

    const ratingStars =
      data.rating > 0 ? '⭐'.repeat(data.rating) : 'No rating';

    const subject = `${typeEmoji} New Feedback: ${typeLabel}${
      data.rating > 0 ? ` - ${ratingStars}` : ''
    }`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feedback Received</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .badge-bug {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .badge-feature {
      background-color: #dbeafe;
      color: #2563eb;
    }
    .badge-general {
      background-color: #e0e7ff;
      color: #6366f1;
    }
    .rating {
      font-size: 20px;
      margin: 10px 0;
    }
    .info-section {
      background: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-row {
      display: flex;
      margin: 8px 0;
      font-size: 14px;
    }
    .info-label {
      font-weight: 600;
      min-width: 100px;
      color: #6b7280;
    }
    .info-value {
      color: #111827;
    }
    .message-box {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
      color: #374151;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 20px 0;
    }
    .timestamp {
      color: #9ca3af;
      font-size: 13px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${typeEmoji} New Feedback Received</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Feedback Type Badge -->
      <div>
        <span class="badge badge-${data.feedbackType}">
          ${typeEmoji} ${typeLabel}
        </span>
      </div>

      <!-- Rating -->
      ${
        data.rating > 0
          ? `
      <div class="rating">
        Rating: ${ratingStars} (${data.rating}/5)
      </div>
      `
          : ''
      }

      <div class="divider"></div>

      <!-- User Information -->
      <div class="info-section">
        <h3 style="margin-top: 0; color: #111827; font-size: 16px;">👤 User Information</h3>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${data.name}</span>
        </div>
        ${
          data.email
            ? `
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></span>
        </div>
        `
            : `
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value" style="color: #9ca3af;">Not provided</span>
        </div>
        `
        }
        ${
          data.userId
            ? `
        <div class="info-row">
          <span class="info-label">User ID:</span>
          <span class="info-value" style="font-family: monospace; font-size: 12px;">${data.userId}</span>
        </div>
        `
            : `
        <div class="info-row">
          <span class="info-label">User Status:</span>
          <span class="info-value" style="color: #9ca3af;">Anonymous (Not logged in)</span>
        </div>
        `
        }
      </div>

      <!-- Feedback Message -->
      <h3 style="color: #111827; font-size: 16px; margin-bottom: 10px;">💬 Message:</h3>
      <div class="message-box">
${data.message}
      </div>

      <!-- Timestamp -->
      <div class="timestamp">
        📅 Submitted on: ${data.submittedAt.toLocaleString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        })} IST
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 5px 0;">
        This is an automated notification from <strong>MutualFunds.in</strong>
      </p>
      <p style="margin: 5px 0;">
        ${
          data.email
            ? `You can reply directly to this email to respond to the user.`
            : 'User did not provide an email address.'
        }
      </p>
      <p style="margin: 15px 0 5px 0; color: #9ca3af;">
        🔒 This email was sent to: ${this.adminEmail}
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, html };
  }
}

// Export singleton instance
export const feedbackEmailService = new FeedbackEmailService();

/**
 * Helper function to send feedback notification
 */
export async function sendFeedbackNotification(
  feedbackType: string,
  rating: number,
  name: string,
  email: string | null,
  message: string,
  userId: string | null
): Promise<{ success: boolean; error?: string }> {
  return feedbackEmailService.sendFeedbackNotification({
    feedbackType,
    rating,
    name,
    email,
    message,
    userId,
    submittedAt: new Date(),
  });
}
