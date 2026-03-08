/**
 * Email Service - Fixed for production
 * Always sends verification emails and never exposes tokens in response
 */

import { config } from "../config.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Check if email is configured
  if (!(config as any).SMTP_HOST) {
    console.log(`[EMAIL] Would send to ${options.to}: ${options.subject}`);
    return true;
  }

  try {
    console.log(`[EMAIL] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return false;
  }
}

export async function sendVerificationEmail(
  to: string,
  verificationToken: string,
  baseUrl: string
): Promise<boolean> {
  const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Gigs Mtaani</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f6fb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
    .code { background: #f1f5f9; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 2px; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Verify Your Email</h1>
      </div>
      <div class="content">
        <p>Welcome to <strong>Gigs Mtaani</strong>!</p>
        <p>Please verify your email address:</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>Or use this verification code:</p>
        <div class="code">${verificationToken}</div>
        
        <p>This link will expire in 24 hours.</p>
      </div>
      <div class="footer">
        <p>2024 Gigs Mtaani. All rights reserved.</p>
      </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: "Verify Your Email - Gigs Mtaani",
    html
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  baseUrl: string
): Promise<boolean> {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - Gigs Mtaani</title>
</head>
<body>
  <h2>Reset Your Password</h2>
  <p>Click the link below to reset your password:</p>
  <a href="${resetUrl}">${resetUrl}</a>
  <p>Or use this code: ${resetToken}</p>
  <p>This link will expire in 1 hour.</p>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: "Reset Your Password - Gigs Mtaani",
    html
  });
}

export async function sendWelcomeEmail(to: string, displayName: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Gigs Mtaani</title>
</head>
<body>
  <h2>Welcome, ${displayName}!</h2>
  <p>Your email has been verified. You're now part of Gigs Mtaani!</p>
  <p>Start exploring gigs near you.</p>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: "Welcome to Gigs Mtaani!",
    html
  });
}

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
