import { Resend } from 'resend';
import Handlebars from 'handlebars';

interface EmailTemplate {
  subject: string;
  html: string;
}

interface VerificationEmailData {
  name: string;
  verificationUrl: string;
}

interface AlertEmailData {
  name: string;
  fundName: string;
  alertType: string;
  condition: string;
  currentValue: string;
}

interface DigestEmailData {
  name: string;
  portfolioSummary: {
    totalValue: string;
    dayChange: string;
    dayChangePercent: string;
  };
  topPerformers: Array<{
    name: string;
    change: string;
  }>;
  alerts: Array<{
    fundName: string;
    message: string;
  }>;
}

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@mutualfunds.com';
  }

  async sendVerificationEmail(to: string, data: VerificationEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.getVerificationTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Verification email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send verification email to ${to}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendAlertEmail(to: string, data: AlertEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.getAlertTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Alert email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send alert email to ${to}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendDigestEmail(to: string, data: DigestEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.getDigestTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Digest email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send digest email to ${to}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private getVerificationTemplate(): EmailTemplate {
    return {
      subject: 'Verify Your Mutual Funds Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Mutual Funds Portal</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Thank you for signing up! Please verify your email address to complete your account setup.</p>
              <p>Click the button below to verify your account:</p>
              <a href="{{verificationUrl}}" class="button">Verify Account</a>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  private getAlertTemplate(): EmailTemplate {
    return {
      subject: 'Investment Alert - {{fundName}}',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Investment Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Investment Alert</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Your alert for <strong>{{fundName}}</strong> has been triggered.</p>
              <div class="alert-box">
                <h3>Alert Details:</h3>
                <p><strong>Type:</strong> {{alertType}}</p>
                <p><strong>Condition:</strong> {{condition}}</p>
                <p><strong>Current Value:</strong> {{currentValue}}</p>
              </div>
              <p>Please review your investment strategy and consider appropriate action.</p>
              <p>Login to your account to manage your alerts and portfolio.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  private getDigestTemplate(): EmailTemplate {
    return {
      subject: 'Your Daily Investment Digest',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Digest</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .summary-box { background: #f0f9ff; border: 1px solid #7dd3fc; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .performer { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .performer:last-child { border-bottom: none; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Investment Digest</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Here's your daily portfolio summary:</p>
              
              <div class="summary-box">
                <h3>Portfolio Summary</h3>
                <p><strong>Total Value:</strong> {{portfolioSummary.totalValue}}</p>
                <p><strong>Today's Change:</strong> 
                  <span class="{{#if portfolioSummary.dayChange}}{{#if (gt portfolioSummary.dayChange 0)}}positive{{else}}negative{{/if}}{{/if}}">
                    {{portfolioSummary.dayChange}} ({{portfolioSummary.dayChangePercent}})
                  </span>
                </p>
              </div>

              {{#if topPerformers}}
              <h3>Top Performers</h3>
              {{#each topPerformers}}
              <div class="performer">
                <strong>{{name}}</strong>: <span class="positive">{{change}}</span>
              </div>
              {{/each}}
              {{/if}}

              {{#if alerts}}
              <h3>Active Alerts</h3>
              {{#each alerts}}
              <div class="performer">
                <strong>{{fundName}}</strong>: {{message}}
              </div>
              {{/each}}
              {{/if}}

              <p>Login to your account for detailed analysis and portfolio management.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
}

export const emailService = new EmailService();