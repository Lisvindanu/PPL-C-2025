const nodemailer = require('nodemailer');
const axios = require('axios');

/**
 * NotificationService - Unified service for sending OTP via Email (Gmail SMTP) and WhatsApp
 * Supports production-ready configuration with fallback mechanisms
 */
class NotificationService {
  constructor() {
    this.emailTransport = null;
    this.whatsappConfig = null;
    this.initializeEmailTransport();
    this.initializeWhatsAppConfig();
  }

  /**
   * Initialize Gmail SMTP Transport
   */
  initializeEmailTransport() {
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        
        this.emailTransport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port,
          secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS // Use App Password for Gmail
          },
          tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
          }
        });

        // Verify connection
        this.emailTransport.verify((error) => {
          if (error) {
            console.error('[NotificationService] SMTP connection error:', error);
          } else {
            console.log('[NotificationService] SMTP ready to send emails');
          }
        });
      } else {
        console.warn('[NotificationService] SMTP not configured - email sending disabled');
      }
    } catch (err) {
      console.error('[NotificationService] Failed to initialize SMTP:', err);
    }
  }

  /**
   * Initialize WhatsApp Cloud API Configuration
   */
  initializeWhatsAppConfig() {
    try {
      if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
        this.whatsappConfig = {
          phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
          accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
          apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
          businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
        };
        console.log('[NotificationService] WhatsApp Cloud API configured');
      } else {
        console.warn('[NotificationService] WhatsApp not configured - WhatsApp sending disabled');
      }
    } catch (err) {
      console.error('[NotificationService] Failed to initialize WhatsApp:', err);
    }
  }

  /**
   * Send OTP via Email (Gmail SMTP)
   * @param {string} email - Recipient email address
   * @param {string} otp - OTP code
   * @param {string} purpose - Purpose of OTP (e.g., 'password_reset', 'verification')
   * @returns {Promise<Object>} Result object with success status
   */
  async sendOTPEmail(email, otp, purpose = 'verification') {
    if (!this.emailTransport) {
      console.error('[NotificationService] Email transport not configured');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const subject = this.getEmailSubject(purpose);
      const { text, html } = this.getEmailContent(otp, purpose);
      const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

      const info = await this.emailTransport.sendMail({
        from: `"${process.env.APP_NAME || 'SkillConnect'}" <${fromAddress}>`,
        to: email,
        subject,
        text,
        html
      });

      console.log('[NotificationService] Email sent successfully:', info.messageId);
      return { 
        success: true, 
        messageId: info.messageId,
        channel: 'email'
      };
    } catch (error) {
      console.error('[NotificationService] Email sending failed:', error);
      return { 
        success: false, 
        error: error.message,
        channel: 'email'
      };
    }
  }

  /**
   * Send OTP via WhatsApp Cloud API
   * @param {string} phoneNumber - Recipient phone number (format: 628123456789)
   * @param {string} otp - OTP code
   * @param {string} purpose - Purpose of OTP
   * @returns {Promise<Object>} Result object with success status
   */
  async sendOTPWhatsApp(phoneNumber, otp, purpose = 'verification') {
    if (!this.whatsappConfig) {
      console.error('[NotificationService] WhatsApp not configured');
      return { success: false, error: 'WhatsApp service not configured' };
    }

    try {
      // Format phone number (remove + if present, ensure country code)
      const formattedPhone = phoneNumber.replace(/\+/g, '').replace(/^0/, '62');
      
      const message = this.getWhatsAppMessage(otp, purpose);
      const url = `https://graph.facebook.com/${this.whatsappConfig.apiVersion}/${this.whatsappConfig.phoneNumberId}/messages`;

      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.whatsappConfig.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[NotificationService] WhatsApp sent successfully:', response.data);
      return { 
        success: true, 
        messageId: response.data.messages[0].id,
        channel: 'whatsapp'
      };
    } catch (error) {
      console.error('[NotificationService] WhatsApp sending failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message,
        channel: 'whatsapp'
      };
    }
  }

  /**
   * Send OTP via multiple channels (Email + WhatsApp)
   * @param {Object} options - Notification options
   * @param {string} options.email - Email address
   * @param {string} options.phoneNumber - Phone number
   * @param {string} options.otp - OTP code
   * @param {string} options.purpose - Purpose of OTP
   * @param {Array<string>} options.channels - Channels to use ['email', 'whatsapp']
   * @returns {Promise<Object>} Combined results
   */
  async sendOTP({ email, phoneNumber, otp, purpose = 'verification', channels = ['email'] }) {
    const results = {
      success: false,
      channels: {},
      errors: []
    };

    // Send via Email
    if (channels.includes('email') && email) {
      const emailResult = await this.sendOTPEmail(email, otp, purpose);
      results.channels.email = emailResult;
      if (emailResult.success) {
        results.success = true;
      } else {
        results.errors.push(`Email: ${emailResult.error}`);
      }
    }

    // Send via WhatsApp
    if (channels.includes('whatsapp') && phoneNumber) {
      const whatsappResult = await this.sendOTPWhatsApp(phoneNumber, otp, purpose);
      results.channels.whatsapp = whatsappResult;
      if (whatsappResult.success) {
        results.success = true;
      } else {
        results.errors.push(`WhatsApp: ${whatsappResult.error}`);
      }
    }

    return results;
  }

  /**
   * Get email subject based on purpose
   */
  getEmailSubject(purpose) {
    const subjects = {
      password_reset: 'Kode OTP Reset Password - SkillConnect',
      verification: 'Kode Verifikasi Akun - SkillConnect',
      login: 'Kode OTP Login - SkillConnect',
      transaction: 'Kode Verifikasi Transaksi - SkillConnect'
    };
    return subjects[purpose] || 'Kode OTP - SkillConnect';
  }

  /**
   * Get email content (text and HTML)
   */
  getEmailContent(otp, purpose) {
    const appName = process.env.APP_NAME || 'SkillConnect';
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '10';

    const purposeText = {
      password_reset: 'reset password',
      verification: 'verifikasi akun',
      login: 'login',
      transaction: 'verifikasi transaksi'
    };

    const text = `
Halo,

Kode OTP Anda untuk ${purposeText[purpose] || 'verifikasi'} adalah:

${otp}

Kode ini berlaku selama ${expiryMinutes} menit.
Jangan bagikan kode ini kepada siapapun.

Jika Anda tidak melakukan permintaan ini, abaikan email ini.

Terima kasih,
Tim ${appName}
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .otp-box { background: #f4f4f4; border: 2px dashed #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
    .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Kode OTP ${appName}</h2>
    <p>Halo,</p>
    <p>Kode OTP Anda untuk <strong>${purposeText[purpose] || 'verifikasi'}</strong> adalah:</p>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    
    <p>Kode ini berlaku selama <strong>${expiryMinutes} menit</strong>.</p>
    
    <div class="warning">
      <strong>⚠️ Penting:</strong> Jangan bagikan kode ini kepada siapapun, termasuk tim ${appName}.
    </div>
    
    <p>Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
    
    <div class="footer">
      <p>Terima kasih,<br>Tim ${appName}</p>
      <p style="font-size: 11px; color: #999;">Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { text, html };
  }

  /**
   * Get WhatsApp message content
   */
  getWhatsAppMessage(otp, purpose) {
    const appName = process.env.APP_NAME || 'SkillConnect';
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '10';

    const purposeText = {
      password_reset: 'reset password',
      verification: 'verifikasi akun',
      login: 'login',
      transaction: 'verifikasi transaksi'
    };

    return `
*${appName} - Kode OTP*

Kode OTP Anda untuk ${purposeText[purpose] || 'verifikasi'}:

*${otp}*

Berlaku selama ${expiryMinutes} menit.
🔒 Jangan bagikan kode ini kepada siapapun.

Jika Anda tidak melakukan permintaan ini, abaikan pesan ini.
    `.trim();
  }

  /**
   * Generate random OTP code
   * @param {number} length - Length of OTP (default: 6)
   * @returns {string} OTP code
   */
  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }
}

module.exports = NotificationService;
