const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';

class EmailService {
  async sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/users/verify-email?token=${encodeURIComponent(token)}`;
    // Dev mock: log the URL; in production integrate with SMTP/provider
    /* eslint-disable no-console */
    console.log(`[EmailService] Send verification to ${email}: ${verifyUrl}`);
    return { success: true, verifyUrl, redirectUrl: `${appBaseUrl}/verify-email?token=${encodeURIComponent(token)}` };
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;
    console.log(`[EmailService] Send password reset to ${email}: ${resetUrl}`);
    return { success: true, resetUrl };
  }
}

module.exports = EmailService;


