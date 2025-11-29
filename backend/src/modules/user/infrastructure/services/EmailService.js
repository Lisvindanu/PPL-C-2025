const nodemailer = require('nodemailer');

const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';

class EmailService {
  constructor() {
    this.transport = null;
    // Configure SMTP transport when EMAIL_SERVICE=smtp
    try {
      if ((process.env.EMAIL_SERVICE || '').toLowerCase() === 'smtp' && process.env.SMTP_HOST) {
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        this.transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port,
          secure: port === 465, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      }
    } catch (err) {
      /* eslint-disable no-console */
      console.error('[EmailService] Failed to create SMTP transport', err);
    }
  }

  async _sendMail({ to, subject, text, html }) {
    if (!this.transport) {
      /* eslint-disable no-console */
      console.log('[EmailService] SMTP not configured - fallback log', { to, subject });
      return { success: true, info: 'logged-only' };
    }

    try {
      const fromAddress = process.env.FROM_EMAIL;
      const info = await this.transport.sendMail({
        from: fromAddress,
        to,
        subject,
        text,
        html
      });
      return { success: true, info };
    } catch (err) {
      /* eslint-disable no-console */
      console.error('[EmailService] sendMail error', err);
      return { success: false, error: err };
    }
  }

  async sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/users/verify-email?token=${encodeURIComponent(token)}`;
    const redirectUrl = `${appBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const subject = 'Verify your email';
    const text = `Please verify your email by visiting ${verifyUrl}`;
    const html = `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify email</a></p>`;

    const result = await this._sendMail({ to: email, subject, text, html });
    return { success: result.success, verifyUrl, redirectUrl, info: result.info };
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;
    const subject = 'Password reset request';
    const text = `Reset your password using this link: ${resetUrl}`;
    const html = `<p>Reset your password using this link:</p><p><a href="${resetUrl}">Reset password</a></p>`;

    const result = await this._sendMail({ to: email, subject, text, html });
    return { success: result.success, resetUrl, info: result.info };
  }
}

module.exports = EmailService;
