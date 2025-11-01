/**
 * Request Refund Use Case
 * Handle refund requests untuk pembayaran
 */

const PaymentModel = require('../../infrastructure/models/PaymentModel');
const EscrowModel = require('../../infrastructure/models/EscrowModel');
const { v4: uuidv4 } = require('uuid');

class RequestRefund {
  async execute({ pembayaran_id, user_id, alasan, jumlah_refund }) {
    try {
      // Get payment
      const payment = await PaymentModel.findByPk(pembayaran_id);

      if (!payment) {
        throw new Error('Payment tidak ditemukan');
      }

      // Validasi status pembayaran
      if (!['paid', 'success', 'settlement'].includes(payment.status)) {
        throw new Error('Payment belum dibayar atau sudah direfund');
      }

      // Check if already refunded
      const existingRefund = await payment.sequelize.models.refund.findOne({
        where: {
          pembayaran_id,
          status: ['pending', 'disetujui']
        }
      });

      if (existingRefund) {
        throw new Error('Refund request sudah ada untuk payment ini');
      }

      // Default refund amount = payment amount
      const refundAmount = jumlah_refund || payment.jumlah;

      // Validasi jumlah refund
      if (refundAmount > payment.jumlah) {
        throw new Error('Jumlah refund tidak boleh lebih dari jumlah pembayaran');
      }

      // Create refund record
      const refund = await payment.sequelize.models.refund.create({
        id: uuidv4(),
        pembayaran_id,
        user_id,
        alasan,
        jumlah: refundAmount,
        status: 'pending',
        diajukan_pada: new Date(),
        disetujui_pada: null,
        ditolak_pada: null,
        catatan_admin: null
      });

      // If there's escrow, update status
      const escrow = await EscrowModel.findOne({
        where: { pembayaran_id }
      });

      if (escrow && escrow.status === 'ditahan') {
        await escrow.update({
          status: 'refund_pending'
        });
      }

      return {
        refund,
        message: 'Refund request berhasil dibuat. Menunggu persetujuan admin.'
      };

    } catch (error) {
      console.error('[REQUEST REFUND] Error:', error);
      throw error;
    }
  }
}

module.exports = RequestRefund;
