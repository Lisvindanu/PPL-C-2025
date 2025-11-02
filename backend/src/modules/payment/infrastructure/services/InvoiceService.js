/**
 * Invoice Service
 * Generate PDF invoice untuk pembayaran
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceService {
  constructor() {
    // Ensure invoices directory exists
    this.invoiceDir = path.join(__dirname, '../../../../../invoices');
    if (!fs.existsSync(this.invoiceDir)) {
      fs.mkdirSync(this.invoiceDir, { recursive: true });
    }
  }

  /**
   * Generate invoice PDF
   * @param {Object} paymentData - Data pembayaran
   * @param {Object} orderData - Data pesanan (optional)
   * @param {Object} userData - Data user (optional)
   * @returns {Promise<string>} - Path to generated PDF
   */
  async generateInvoice(paymentData, orderData = {}, userData = {}) {
    return new Promise((resolve, reject) => {
      try {
        const fileName = `INV-${paymentData.nomor_invoice || paymentData.id}.pdf`;
        const filePath = path.join(this.invoiceDir, fileName);

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header - Logo & Company Info
        doc
          .fontSize(24)
          .fillColor('#4F46E5')
          .text('SkillConnect', 50, 50)
          .fontSize(10)
          .fillColor('#666666')
          .text('Marketplace Jasa & Skill Lokal', 50, 80)
          .text('https://skillconnect.id', 50, 95);

        // Invoice Title
        doc
          .fontSize(28)
          .fillColor('#000000')
          .text('INVOICE', 400, 50, { align: 'right' });

        // Invoice Number & Date
        doc
          .fontSize(10)
          .fillColor('#666666')
          .text(`No: ${paymentData.nomor_invoice || paymentData.id}`, 400, 85, { align: 'right' })
          .text(`Tanggal: ${new Date(paymentData.created_at || Date.now()).toLocaleDateString('id-ID')}`, 400, 100, { align: 'right' });

        // Line separator
        doc
          .strokeColor('#E5E7EB')
          .lineWidth(1)
          .moveTo(50, 130)
          .lineTo(550, 130)
          .stroke();

        // Bill To Section
        doc
          .fontSize(12)
          .fillColor('#000000')
          .text('Tagihan Untuk:', 50, 150);

        doc
          .fontSize(10)
          .fillColor('#666666')
          .text(userData.nama || 'Customer', 50, 170)
          .text(userData.email || '-', 50, 185)
          .text(userData.no_hp || '-', 50, 200);

        // Payment Details Section
        doc
          .fontSize(12)
          .fillColor('#000000')
          .text('Detail Pembayaran:', 50, 240);

        // Table Header
        const tableTop = 270;
        doc
          .fontSize(10)
          .fillColor('#000000')
          .text('Deskripsi', 50, tableTop)
          .text('Jumlah', 400, tableTop, { align: 'right' });

        // Line under header
        doc
          .strokeColor('#E5E7EB')
          .lineWidth(1)
          .moveTo(50, tableTop + 15)
          .lineTo(550, tableTop + 15)
          .stroke();

        // Table Content
        let yPosition = tableTop + 30;

        // Service/Order name
        const serviceName = orderData.judul || 'Layanan SkillConnect';
        doc
          .fontSize(10)
          .fillColor('#666666')
          .text(serviceName, 50, yPosition)
          .text(this.formatCurrency(paymentData.jumlah), 400, yPosition, { align: 'right' });

        yPosition += 20;

        // Platform Fee
        if (paymentData.biaya_platform) {
          doc
            .text('Biaya Platform', 50, yPosition)
            .text(this.formatCurrency(paymentData.biaya_platform), 400, yPosition, { align: 'right' });
          yPosition += 20;
        }

        // Payment Gateway Fee
        if (paymentData.biaya_payment_gateway) {
          doc
            .text('Biaya Payment Gateway', 50, yPosition)
            .text(this.formatCurrency(paymentData.biaya_payment_gateway), 400, yPosition, { align: 'right' });
          yPosition += 20;
        }

        // Subtotal line
        yPosition += 10;
        doc
          .strokeColor('#E5E7EB')
          .lineWidth(1)
          .moveTo(50, yPosition)
          .lineTo(550, yPosition)
          .stroke();

        yPosition += 20;

        // Total
        const totalAmount = paymentData.jumlah +
                           (paymentData.biaya_platform || 0) +
                           (paymentData.biaya_payment_gateway || 0);

        doc
          .fontSize(12)
          .fillColor('#000000')
          .text('TOTAL', 50, yPosition)
          .text(this.formatCurrency(totalAmount), 400, yPosition, { align: 'right' });

        // Payment Info
        yPosition += 50;
        doc
          .fontSize(10)
          .fillColor('#666666')
          .text(`Metode Pembayaran: ${paymentData.metode_pembayaran || '-'}`, 50, yPosition)
          .text(`Payment Gateway: ${paymentData.payment_gateway || 'Mock Payment'}`, 50, yPosition + 15)
          .text(`Status: ${this.getStatusText(paymentData.status)}`, 50, yPosition + 30);

        // Footer
        const footerY = 700;
        doc
          .fontSize(8)
          .fillColor('#999999')
          .text('Terima kasih telah menggunakan SkillConnect!', 50, footerY, { align: 'center', width: 500 })
          .text('Invoice ini digenerate secara otomatis oleh sistem.', 50, footerY + 15, { align: 'center', width: 500 })
          .text('Untuk pertanyaan, hubungi support@skillconnect.id', 50, footerY + 30, { align: 'center', width: 500 });

        // Finalize PDF
        doc.end();

        writeStream.on('finish', () => {
          resolve(filePath);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
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

  /**
   * Get status text in Indonesian
   */
  getStatusText(status) {
    const statusMap = {
      'pending': 'Menunggu Pembayaran',
      'paid': 'Sudah Dibayar',
      'success': 'Berhasil',
      'settlement': 'Selesai',
      'failed': 'Gagal',
      'expired': 'Kadaluarsa',
      'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
  }

  /**
   * Get invoice path by payment ID
   */
  getInvoicePath(paymentId, invoiceNumber) {
    const fileName = `INV-${invoiceNumber || paymentId}.pdf`;
    return path.join(this.invoiceDir, fileName);
  }

  /**
   * Check if invoice exists
   */
  invoiceExists(paymentId, invoiceNumber) {
    const filePath = this.getInvoicePath(paymentId, invoiceNumber);
    return fs.existsSync(filePath);
  }

  /**
   * Delete invoice
   */
  deleteInvoice(paymentId, invoiceNumber) {
    const filePath = this.getInvoicePath(paymentId, invoiceNumber);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}

module.exports = InvoiceService;
