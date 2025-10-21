/**
 * Release Escrow Use Case
 * Handle release dana dari escrow ke freelancer (client approve)
 */

const EscrowService = require('../../infrastructure/services/EscrowService');
const EscrowModel = require('../../infrastructure/models/EscrowModel');

class ReleaseEscrow {
  constructor() {
    this.escrowService = new EscrowService();
  }

  /**
   * Execute escrow release
   * @param {Object} dto - Release data
   * @returns {Promise<Object>} Release result
   */
  async execute(dto) {
    const { escrow_id, user_id, reason } = dto;

    console.log(`[ESCROW RELEASE] Releasing escrow ${escrow_id} by user ${user_id}`);

    // 1. Validate escrow exists
    const escrow = await EscrowModel.findByPk(escrow_id);

    if (!escrow) {
      throw new Error('Escrow not found');
    }

    // 2. Validate escrow is in held status
    if (escrow.status !== 'held') {
      throw new Error(`Cannot release escrow with status: ${escrow.status}`);
    }

    // Note: User authorization validation will be added when auth middleware is implemented
    // Expected: Only the client who made the payment can release escrow

    // 3. Release escrow
    const releasedEscrow = await this.escrowService.releaseEscrow(escrow_id, user_id);

    console.log(`[ESCROW RELEASE] Successfully released escrow ${escrow_id}`);
    console.log(`[ESCROW RELEASE] Net amount to freelancer: Rp ${parseFloat(releasedEscrow.jumlah_ditahan) - parseFloat(releasedEscrow.biaya_platform)}`);

    // Integration points for other modules:
    // - Order module: Update order status to 'selesai'
    // - Notification module: Send notification to freelancer
    // - Freelancer can now withdraw funds via /api/payments/withdraw

    return {
      success: true,
      escrow_id: releasedEscrow.id,
      status: releasedEscrow.status,
      jumlah_ditahan: parseFloat(releasedEscrow.jumlah_ditahan),
      biaya_platform: parseFloat(releasedEscrow.biaya_platform),
      jumlah_bersih: parseFloat(releasedEscrow.jumlah_ditahan) - parseFloat(releasedEscrow.biaya_platform),
      dirilis_pada: releasedEscrow.dirilis_pada,
      message: 'Escrow released successfully. Freelancer can now withdraw funds.'
    };
  }
}

module.exports = ReleaseEscrow;
