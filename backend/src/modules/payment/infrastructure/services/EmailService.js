/**
 * Email Service
 * Send email notifications untuk payment events
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Setup email transporter
    // Untuk development, gunakan ethereal.email (fake SMTP)
    // Untuk production, gunakan Gmail/SendGrid/etc
    this.transporter = null;
    this.setupTransporter();
  }

  async setupTransporter() {
    if (process.env.NODE_ENV === 'production' && process.env.EMAIL_HOST) {
      // Production email config
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Development - use ethereal (test email)
      // Atau mock console.log saja
      console.log('[EMAIL SERVICE] Running in development mode - emails will be logged to console');
    }
  }

  /**
   * Send payment success email
   */
  async sendPaymentSuccessEmail(to, paymentData, invoicePath = null) {
    try {
      const emailContent = {
        from: process.env.EMAIL_FROM || '"SkillConnect" <noreply@skillconnect.id>',
        to: to,
        subject: `Pembayaran Berhasil - ${paymentData.nomor_invoice || paymentData.id}`,
        html: this.generatePaymentSuccessHTML(paymentData),
        attachments: invoicePath ? [{
          filename: `Invoice-${paymentData.nomor_invoice || paymentData.id}.pdf`,
          path: invoicePath
        }] : []
      };

      if (this.transporter) {
        const info = await this.transporter.sendMail(emailContent);
        console.log('[EMAIL] Payment success email sent:', info.messageId);
        return info;
      } else {
        // Development mode - log to console
        console.log('[EMAIL] Payment Success Email (Development Mode):');
        console.log('To:', to);
        console.log('Subject:', emailContent.subject);
        console.log('Invoice attached:', invoicePath ? 'Yes' : 'No');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('[EMAIL] Error sending payment success email:', error);
      throw error;
    }
  }

  /**
   * Send payment failed email
   */
  async sendPaymentFailedEmail(to, paymentData) {
    try {
      const emailContent = {
        from: process.env.EMAIL_FROM || '"SkillConnect" <noreply@skillconnect.id>',
        to: to,
        subject: `Pembayaran Gagal - ${paymentData.nomor_invoice || paymentData.id}`,
        html: this.generatePaymentFailedHTML(paymentData)
      };

      if (this.transporter) {
        const info = await this.transporter.sendMail(emailContent);
        console.log('[EMAIL] Payment failed email sent:', info.messageId);
        return info;
      } else {
        // Development mode
        console.log('[EMAIL] Payment Failed Email (Development Mode):');
        console.log('To:', to);
        console.log('Subject:', emailContent.subject);
        return { messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('[EMAIL] Error sending payment failed email:', error);
      throw error;
    }
  }

  /**
   * Send withdrawal request email (to admin)
   */
  async sendWithdrawalRequestEmail(adminEmail, withdrawalData, userData) {
    try {
      const emailContent = {
        from: process.env.EMAIL_FROM || '"SkillConnect" <noreply@skillconnect.id>',
        to: adminEmail,
        subject: `[ADMIN] Permintaan Penarikan Dana - ${this.formatCurrency(withdrawalData.jumlah)}`,
        html: this.generateWithdrawalRequestHTML(withdrawalData, userData)
      };

      if (this.transporter) {
        const info = await this.transporter.sendMail(emailContent);
        console.log('[EMAIL] Withdrawal request email sent:', info.messageId);
        return info;
      } else {
        console.log('[EMAIL] Withdrawal Request Email (Development Mode):');
        console.log('To:', adminEmail);
        console.log('Subject:', emailContent.subject);
        return { messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('[EMAIL] Error sending withdrawal request email:', error);
      throw error;
    }
  }

  /**
   * Send withdrawal approved email
   */
  async sendWithdrawalApprovedEmail(to, withdrawalData) {
    try {
      const emailContent = {
        from: process.env.EMAIL_FROM || '"SkillConnect" <noreply@skillconnect.id>',
        to: to,
        subject: `Penarikan Dana Disetujui - ${this.formatCurrency(withdrawalData.jumlah)}`,
        html: this.generateWithdrawalApprovedHTML(withdrawalData)
      };

      if (this.transporter) {
        const info = await this.transporter.sendMail(emailContent);
        console.log('[EMAIL] Withdrawal approved email sent:', info.messageId);
        return info;
      } else {
        console.log('[EMAIL] Withdrawal Approved Email (Development Mode):');
        console.log('To:', to);
        console.log('Subject:', emailContent.subject);
        return { messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('[EMAIL] Error sending withdrawal approved email:', error);
      throw error;
    }
  }

  // ==================== HTML TEMPLATES ====================

  generatePaymentSuccessHTML(paymentData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .success-box { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillConnect</h1>
      <p>Marketplace Jasa & Skill Lokal</p>
    </div>
    <div class="content">
      <div class="success-box">
        <h2>✅ Pembayaran Berhasil!</h2>
      </div>
      <p>Terima kasih, pembayaran Anda telah berhasil diproses.</p>

      <div class="info-box">
        <h3>Detail Pembayaran</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Nomor Invoice:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${paymentData.nomor_invoice || paymentData.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Jumlah:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: bold;">${this.formatCurrency(paymentData.jumlah)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Metode:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${paymentData.metode_pembayaran || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Tanggal:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${new Date(paymentData.created_at || Date.now()).toLocaleString('id-ID')}</td>
          </tr>
        </table>
      </div>

      <p>Invoice terlampir dalam email ini. Anda juga dapat mengunduhnya dari dashboard Anda.</p>

      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/payments" class="button">Lihat Detail Pembayaran</a>
      </center>
    </div>
    <div class="footer">
      <p>Email ini dikirim secara otomatis oleh sistem SkillConnect.</p>
      <p>Jika Anda memiliki pertanyaan, hubungi kami di support@skillconnect.id</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  generatePaymentFailedHTML(paymentData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .error-box { background: #ef4444; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillConnect</h1>
      <p>Marketplace Jasa & Skill Lokal</p>
    </div>
    <div class="content">
      <div class="error-box">
        <h2>❌ Pembayaran Gagal</h2>
      </div>
      <p>Maaf, pembayaran Anda tidak dapat diproses.</p>

      <div class="info-box">
        <h3>Detail Transaksi</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Nomor Invoice:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${paymentData.nomor_invoice || paymentData.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Jumlah:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${this.formatCurrency(paymentData.jumlah)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #ef4444;">Gagal</td>
          </tr>
        </table>
      </div>

      <p>Silakan coba lagi atau gunakan metode pembayaran lain.</p>

      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/payments" class="button">Coba Lagi</a>
      </center>
    </div>
    <div class="footer">
      <p>Email ini dikirim secara otomatis oleh sistem SkillConnect.</p>
      <p>Jika Anda memiliki pertanyaan, hubungi kami di support@skillconnect.id</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  generateWithdrawalRequestHTML(withdrawalData, userData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1f2937; color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .warning-box { background: #f59e0b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Permintaan Penarikan Dana</h1>
    </div>
    <div class="content">
      <div class="warning-box">
        <h2>Perlu Persetujuan Admin</h2>
      </div>

      <div class="info-box">
        <h3>Detail Penarikan</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>User:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${userData.nama || '-'} (${userData.email || '-'})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Jumlah:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #f59e0b; font-weight: bold;">${this.formatCurrency(withdrawalData.jumlah)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Rekening:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${withdrawalData.nomor_rekening || '-'} (${withdrawalData.bank || '-'})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Tanggal:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('id-ID')}</td>
          </tr>
        </table>
      </div>

      <p>Silakan review dan setujui/tolak permintaan ini dari Admin Dashboard.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  generateWithdrawalApprovedHTML(withdrawalData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .success-box { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillConnect</h1>
    </div>
    <div class="content">
      <div class="success-box">
        <h2>✅ Penarikan Dana Disetujui</h2>
      </div>
      <p>Permintaan penarikan dana Anda telah disetujui dan sedang diproses.</p>

      <div class="info-box">
        <h3>Detail Penarikan</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Jumlah:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: bold;">${this.formatCurrency(withdrawalData.jumlah)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Rekening Tujuan:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${withdrawalData.nomor_rekening || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Bank:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${withdrawalData.bank || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #10b981;">Disetujui</td>
          </tr>
        </table>
      </div>

      <p>Dana akan ditransfer dalam 1-3 hari kerja.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Format currency to IDR
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }
}

module.exports = EmailService;
