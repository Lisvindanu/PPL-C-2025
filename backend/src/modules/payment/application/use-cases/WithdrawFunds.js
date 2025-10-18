/**
 * Withdraw Funds Use Case
 * Handle freelancer withdrawal request
 */

const WithdrawalService = require('../../infrastructure/services/WithdrawalService');
const EscrowModel = require('../../infrastructure/models/EscrowModel');

class WithdrawFunds {
  constructor() {
    this.withdrawalService = new WithdrawalService();
  }

  /**
   * Execute withdrawal request
   * @param {Object} dto - Withdrawal data
   * @returns {Promise<Object>} Withdrawal result
   */
  async execute(dto) {
    const {
      escrow_id,
      freelancer_id,
      metode_pembayaran_id,
      metode_pencairan,
      nomor_rekening,
      nama_pemilik
    } = dto;

    console.log(`[WITHDRAWAL] Creating withdrawal for freelancer ${freelancer_id}`);
    console.log(`[WITHDRAWAL] Escrow: ${escrow_id}`);

    // 1. Validate escrow exists and is released
    const escrow = await EscrowModel.findByPk(escrow_id);

    if (!escrow) {
      throw new Error('Escrow not found');
    }

    if (escrow.status !== 'released') {
      throw new Error(`Cannot withdraw from escrow with status: ${escrow.status}. Escrow must be released first.`);
    }

    // Note: Freelancer ownership validation will be added when auth middleware is implemented
    // Expected: Only the freelancer who completed the order can withdraw

    // 2. Create withdrawal request
    const withdrawal = await this.withdrawalService.createWithdrawal({
      escrow_id,
      freelancer_id,
      metode_pembayaran_id,
      metode_pencairan,
      nomor_rekening,
      nama_pemilik
    });

    console.log(`[WITHDRAWAL] Withdrawal request created: ${withdrawal.id}`);
    console.log(`[WITHDRAWAL] Net amount: Rp ${withdrawal.jumlah_bersih}`);

    // 3. For mock gateway, auto-process withdrawal
    if (process.env.MOCK_AUTO_WITHDRAWAL === 'true') {
      console.log(`[WITHDRAWAL] Auto-processing withdrawal (mock mode)`);
      await this.withdrawalService.mockTransfer(withdrawal.id);

      // Reload withdrawal to get updated status
      const updatedWithdrawal = await this.withdrawalService.toEntity(
        await withdrawal.reload()
      );

      return {
        success: true,
        withdrawal_id: withdrawal.id,
        status: 'completed',
        jumlah: parseFloat(withdrawal.jumlah),
        biaya_platform: parseFloat(withdrawal.biaya_platform),
        jumlah_bersih: parseFloat(withdrawal.jumlah_bersih),
        metode_pencairan: withdrawal.metode_pencairan,
        nomor_rekening: withdrawal.nomor_rekening,
        bukti_transfer: updatedWithdrawal.bukti_transfer,
        dicairkan_pada: updatedWithdrawal.dicairkan_pada,
        message: 'Withdrawal processed successfully (mock mode)'
      };
    }

    // Normal flow: return pending withdrawal
    return {
      success: true,
      withdrawal_id: withdrawal.id,
      status: withdrawal.status,
      jumlah: parseFloat(withdrawal.jumlah),
      biaya_platform: parseFloat(withdrawal.biaya_platform),
      jumlah_bersih: parseFloat(withdrawal.jumlah_bersih),
      metode_pencairan: withdrawal.metode_pencairan,
      nomor_rekening: withdrawal.nomor_rekening,
      message: 'Withdrawal request submitted. Processing by admin.'
    };
  }
}

module.exports = WithdrawFunds;
