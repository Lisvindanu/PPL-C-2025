/**
 * Escrow Service
 * Mengelola hold/release/refund dana dalam escrow
 */

const Escrow = require('../../domain/entities/Escrow');
const EscrowModel = require('../models/EscrowModel');

class EscrowService {
  /**
   * Create escrow untuk hold payment
   */
  async createEscrow({ pembayaran_id, pesanan_id, jumlah_ditahan, biaya_platform = 0 }) {
    // Create escrow entity
    const escrow = new Escrow({
      pembayaran_id,
      pesanan_id,
      jumlah_ditahan,
      biaya_platform
    });

    // Hold the payment
    escrow.hold();

    // Set auto-release date (7 days from now)
    escrow.setAutoReleaseDate(7);

    // Validate
    escrow.validate();

    // Save to database
    const escrowRecord = await EscrowModel.create({
      pembayaran_id: escrow.pembayaran_id,
      pesanan_id: escrow.pesanan_id,
      jumlah_ditahan: escrow.jumlah_ditahan,
      biaya_platform: escrow.biaya_platform,
      status: escrow.status,
      ditahan_pada: escrow.ditahan_pada,
      akan_dirilis_pada: escrow.akan_dirilis_pada
    });

    console.log(`[ESCROW] Created escrow ${escrowRecord.id} for payment ${pembayaran_id}`);
    console.log(`[ESCROW] Amount held: Rp ${jumlah_ditahan}, Platform fee: Rp ${biaya_platform}`);
    console.log(`[ESCROW] Auto-release scheduled for: ${escrow.akan_dirilis_pada}`);

    return escrowRecord;
  }

  /**
   * Release escrow (client approved work)
   */
  async releaseEscrow(escrow_id, userId) {
    const escrowRecord = await EscrowModel.findByPk(escrow_id);

    if (!escrowRecord) {
      throw new Error('Escrow not found');
    }

    const escrow = this.toEntity(escrowRecord);

    // Release escrow
    escrow.release();

    // Update database
    await escrowRecord.update({
      status: escrow.status,
      dirilis_pada: escrow.dirilis_pada
    });

    console.log(`[ESCROW] Released escrow ${escrow_id} by user ${userId}`);
    console.log(`[ESCROW] Net amount to freelancer: Rp ${escrow.getNetAmount()}`);

    return escrowRecord;
  }

  /**
   * Refund escrow (dispute won by client or order cancelled)
   */
  async refundEscrow(escrow_id, reason, userId) {
    const escrowRecord = await EscrowModel.findByPk(escrow_id);

    if (!escrowRecord) {
      throw new Error('Escrow not found');
    }

    const escrow = this.toEntity(escrowRecord);

    // Refund escrow
    escrow.refund(reason);

    // Update database
    await escrowRecord.update({
      status: escrow.status,
      dirilis_pada: escrow.dirilis_pada,
      alasan: escrow.alasan
    });

    console.log(`[ESCROW] Refunded escrow ${escrow_id}`);
    console.log(`[ESCROW] Reason: ${reason}`);
    console.log(`[ESCROW] Refund amount: Rp ${escrow.jumlah_ditahan}`);

    return escrowRecord;
  }

  /**
   * Mark escrow as disputed
   */
  async markAsDisputed(escrow_id) {
    const escrowRecord = await EscrowModel.findByPk(escrow_id);

    if (!escrowRecord) {
      throw new Error('Escrow not found');
    }

    const escrow = this.toEntity(escrowRecord);
    escrow.markAsDisputed();

    await escrowRecord.update({
      status: escrow.status
    });

    console.log(`[ESCROW] Marked escrow ${escrow_id} as disputed`);

    return escrowRecord;
  }

  /**
   * Partial release (untuk kasus dispute)
   */
  async partialRelease(escrow_id, amount, reason, userId) {
    const escrowRecord = await EscrowModel.findByPk(escrow_id);

    if (!escrowRecord) {
      throw new Error('Escrow not found');
    }

    const escrow = this.toEntity(escrowRecord);
    escrow.partialRelease(amount, reason);

    await escrowRecord.update({
      status: escrow.status,
      dirilis_pada: escrow.dirilis_pada,
      alasan: escrow.alasan
    });

    console.log(`[ESCROW] Partial release for escrow ${escrow_id}`);
    console.log(`[ESCROW] Amount: Rp ${amount}, Reason: ${reason}`);

    return escrowRecord;
  }

  /**
   * Get escrow by payment ID
   */
  async getEscrowByPaymentId(pembayaran_id) {
    return await EscrowModel.findOne({
      where: { pembayaran_id }
    });
  }

  /**
   * Get escrow by order ID
   */
  async getEscrowByOrderId(pesanan_id) {
    return await EscrowModel.findOne({
      where: { pesanan_id }
    });
  }

  /**
   * Get all escrows that should auto-release
   * (untuk CRON job)
   */
  async getEscrowsForAutoRelease() {
    const { Op } = require('sequelize');

    return await EscrowModel.findAll({
      where: {
        status: 'held',
        akan_dirilis_pada: {
          [Op.lte]: new Date() // <= current time
        }
      }
    });
  }

  /**
   * Auto-release escrows (CRON job function)
   */
  async autoReleaseEscrows() {
    const escrows = await this.getEscrowsForAutoRelease();

    console.log(`[ESCROW CRON] Found ${escrows.length} escrows to auto-release`);

    const released = [];

    for (const escrowRecord of escrows) {
      try {
        const escrow = this.toEntity(escrowRecord);

        if (escrow.shouldAutoRelease()) {
          escrow.release();

          await escrowRecord.update({
            status: escrow.status,
            dirilis_pada: escrow.dirilis_pada,
            alasan: 'Auto-released after 7 days'
          });

          released.push(escrowRecord.id);

          console.log(`[ESCROW CRON] Auto-released escrow ${escrowRecord.id}`);
        }
      } catch (error) {
        console.error(`[ESCROW CRON] Failed to auto-release escrow ${escrowRecord.id}:`, error);
      }
    }

    console.log(`[ESCROW CRON] Successfully auto-released ${released.length} escrows`);

    return released;
  }

  /**
   * Convert Sequelize model to domain entity
   * @private
   */
  toEntity(escrowRecord) {
    return new Escrow({
      id: escrowRecord.id,
      pembayaran_id: escrowRecord.pembayaran_id,
      pesanan_id: escrowRecord.pesanan_id,
      jumlah_ditahan: parseFloat(escrowRecord.jumlah_ditahan),
      biaya_platform: parseFloat(escrowRecord.biaya_platform),
      status: escrowRecord.status,
      ditahan_pada: escrowRecord.ditahan_pada,
      akan_dirilis_pada: escrowRecord.akan_dirilis_pada,
      dirilis_pada: escrowRecord.dirilis_pada,
      alasan: escrowRecord.alasan,
      created_at: escrowRecord.created_at,
      updated_at: escrowRecord.updated_at
    });
  }
}

module.exports = EscrowService;
