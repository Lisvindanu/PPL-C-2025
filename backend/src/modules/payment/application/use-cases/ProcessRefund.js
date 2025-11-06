/**
 * Process Refund Use Case
 * Admin approve atau reject refund request
 */

const PaymentModel = require('../../infrastructure/models/PaymentModel');
const EscrowModel = require('../../infrastructure/models/EscrowModel');

class ProcessRefund {
  async execute({ refund_id, admin_id, action, catatan_admin }) {
    try {
      // Get refund request
      const RefundModel = PaymentModel.sequelize.models.refund;
      const refund = await RefundModel.findByPk(refund_id);

      if (!refund) {
        throw new Error('Refund request tidak ditemukan');
      }

      if (refund.status !== 'pending') {
        throw new Error('Refund sudah diproses sebelumnya');
      }

      if (action === 'approve') {
        // Approve refund
        await refund.update({
          status: 'disetujui',
          disetujui_pada: new Date(),
          catatan_admin: catatan_admin || 'Refund disetujui'
        });

        // Update payment status
        const payment = await PaymentModel.findByPk(refund.pembayaran_id);
        await payment.update({
          status: 'refunded'
        });

        // Release escrow if exists
        const escrow = await EscrowModel.findOne({
          where: { pembayaran_id: refund.pembayaran_id }
        });

        if (escrow) {
          await escrow.update({
            status: 'refunded',
            dirilis_pada: new Date()
          });
        }

        return {
          refund,
          message: 'Refund berhasil disetujui dan dana telah dikembalikan'
        };

      } else if (action === 'reject') {
        // Reject refund
        await refund.update({
          status: 'ditolak',
          ditolak_pada: new Date(),
          catatan_admin: catatan_admin || 'Refund ditolak'
        });

        // Restore escrow status if exists
        const escrow = await EscrowModel.findOne({
          where: { pembayaran_id: refund.pembayaran_id }
        });

        if (escrow && escrow.status === 'refund_pending') {
          await escrow.update({
            status: 'ditahan'
          });
        }

        return {
          refund,
          message: 'Refund ditolak'
        };

      } else {
        throw new Error('Action tidak valid. Gunakan "approve" atau "reject"');
      }

    } catch (error) {
      console.error('[PROCESS REFUND] Error:', error);
      throw error;
    }
  }
}

module.exports = ProcessRefund;
