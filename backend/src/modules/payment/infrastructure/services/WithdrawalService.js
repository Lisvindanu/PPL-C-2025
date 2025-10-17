/**
 * Withdrawal Service (Pencairan Dana)
 * Mengelola withdrawal/payout dana freelancer
 */

const Withdrawal = require('../../domain/entities/Withdrawal');
const WithdrawalModel = require('../models/WithdrawalModel');
const EscrowModel = require('../models/EscrowModel');

class WithdrawalService {
  /**
   * Create withdrawal request
   */
  async createWithdrawal({
    escrow_id,
    freelancer_id,
    metode_pembayaran_id,
    metode_pencairan,
    nomor_rekening,
    nama_pemilik
  }) {
    // Get escrow to check if it's released
    const escrow = await EscrowModel.findByPk(escrow_id);

    if (!escrow) {
      throw new Error('Escrow not found');
    }

    if (escrow.status !== 'released') {
      throw new Error(`Cannot withdraw from escrow with status: ${escrow.status}`);
    }

    // Calculate amounts
    const amounts = Withdrawal.calculateNetAmount(
      parseFloat(escrow.jumlah_ditahan),
      0.05 // 5% platform fee
    );

    // Create withdrawal entity
    const withdrawal = new Withdrawal({
      escrow_id,
      freelancer_id,
      metode_pembayaran_id,
      jumlah: amounts.jumlah,
      biaya_platform: amounts.biaya_platform,
      jumlah_bersih: amounts.jumlah_bersih,
      metode_pencairan,
      nomor_rekening,
      nama_pemilik,
      status: 'pending'
    });

    // Validate
    withdrawal.validate();

    // Save to database
    const withdrawalRecord = await WithdrawalModel.create({
      escrow_id: withdrawal.escrow_id,
      freelancer_id: withdrawal.freelancer_id,
      metode_pembayaran_id: withdrawal.metode_pembayaran_id,
      jumlah: withdrawal.jumlah,
      biaya_platform: withdrawal.biaya_platform,
      jumlah_bersih: withdrawal.jumlah_bersih,
      metode_pencairan: withdrawal.metode_pencairan,
      nomor_rekening: withdrawal.nomor_rekening,
      nama_pemilik: withdrawal.nama_pemilik,
      status: withdrawal.status
    });

    console.log(`[WITHDRAWAL] Created withdrawal request ${withdrawalRecord.id}`);
    console.log(`[WITHDRAWAL] Freelancer: ${freelancer_id}`);
    console.log(`[WITHDRAWAL] Gross amount: Rp ${amounts.jumlah}`);
    console.log(`[WITHDRAWAL] Platform fee (5%): Rp ${amounts.biaya_platform}`);
    console.log(`[WITHDRAWAL] Net amount: Rp ${amounts.jumlah_bersih}`);
    console.log(`[WITHDRAWAL] Method: ${metode_pencairan} - ${nomor_rekening}`);

    return withdrawalRecord;
  }

  /**
   * Process withdrawal (Admin action or auto-process for mock)
   */
  async processWithdrawal(withdrawal_id, adminId) {
    const withdrawalRecord = await WithdrawalModel.findByPk(withdrawal_id);

    if (!withdrawalRecord) {
      throw new Error('Withdrawal not found');
    }

    const withdrawal = this.toEntity(withdrawalRecord);
    withdrawal.startProcessing();

    await withdrawalRecord.update({
      status: withdrawal.status
    });

    console.log(`[WITHDRAWAL] Processing withdrawal ${withdrawal_id} by admin ${adminId}`);

    // For mock gateway, auto-complete after 2 seconds
    if (process.env.MOCK_AUTO_WITHDRAWAL === 'true') {
      setTimeout(async () => {
        await this.completeWithdrawal(withdrawal_id, `MOCK-TRANSFER-${Date.now()}`);
      }, 2000);
    }

    return withdrawalRecord;
  }

  /**
   * Complete withdrawal (transfer success)
   */
  async completeWithdrawal(withdrawal_id, bukti_transfer) {
    const withdrawalRecord = await WithdrawalModel.findByPk(withdrawal_id);

    if (!withdrawalRecord) {
      throw new Error('Withdrawal not found');
    }

    const withdrawal = this.toEntity(withdrawalRecord);
    withdrawal.complete(bukti_transfer);

    await withdrawalRecord.update({
      status: withdrawal.status,
      bukti_transfer: withdrawal.bukti_transfer,
      dicairkan_pada: withdrawal.dicairkan_pada
    });

    // Update escrow status to completed
    const escrow = await EscrowModel.findByPk(withdrawalRecord.escrow_id);
    if (escrow && escrow.status === 'released') {
      await escrow.update({ status: 'completed' });
    }

    console.log(`[WITHDRAWAL] Completed withdrawal ${withdrawal_id}`);
    console.log(`[WITHDRAWAL] Transfer proof: ${bukti_transfer}`);
    console.log(`[WITHDRAWAL] Amount transferred: Rp ${withdrawal.jumlah_bersih}`);

    return withdrawalRecord;
  }

  /**
   * Fail withdrawal (transfer gagal)
   */
  async failWithdrawal(withdrawal_id, reason) {
    const withdrawalRecord = await WithdrawalModel.findByPk(withdrawal_id);

    if (!withdrawalRecord) {
      throw new Error('Withdrawal not found');
    }

    const withdrawal = this.toEntity(withdrawalRecord);
    withdrawal.fail(reason);

    await withdrawalRecord.update({
      status: withdrawal.status,
      catatan: withdrawal.catatan
    });

    console.log(`[WITHDRAWAL] Failed withdrawal ${withdrawal_id}`);
    console.log(`[WITHDRAWAL] Reason: ${reason}`);

    return withdrawalRecord;
  }

  /**
   * Get freelancer withdrawals
   */
  async getFreelancerWithdrawals(freelancer_id, options = {}) {
    const { status, limit = 10, offset = 0 } = options;

    const where = { freelancer_id };
    if (status) {
      where.status = status;
    }

    return await WithdrawalModel.findAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get freelancer total earnings
   */
  async getFreelancerEarnings(freelancer_id) {
    const { Op } = require('sequelize');
    const { sequelize } = require('../../../../shared/database/connection');

    const result = await WithdrawalModel.findOne({
      where: {
        freelancer_id,
        status: 'completed'
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('jumlah')), 'total_gross'],
        [sequelize.fn('SUM', sequelize.col('biaya_platform')), 'total_fees'],
        [sequelize.fn('SUM', sequelize.col('jumlah_bersih')), 'total_net'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_withdrawals']
      ]
    });

    return {
      total_gross: parseFloat(result.dataValues.total_gross) || 0,
      total_fees: parseFloat(result.dataValues.total_fees) || 0,
      total_net: parseFloat(result.dataValues.total_net) || 0,
      total_withdrawals: parseInt(result.dataValues.total_withdrawals) || 0
    };
  }

  /**
   * Get pending withdrawals (for admin dashboard)
   */
  async getPendingWithdrawals(limit = 50) {
    return await WithdrawalModel.findAll({
      where: { status: 'pending' },
      limit,
      order: [['created_at', 'ASC']]
    });
  }

  /**
   * Mock transfer untuk development/testing
   * Simulasi transfer bank berhasil
   */
  async mockTransfer(withdrawal_id) {
    const withdrawalRecord = await WithdrawalModel.findByPk(withdrawal_id);

    if (!withdrawalRecord) {
      throw new Error('Withdrawal not found');
    }

    // Simulate processing
    await this.processWithdrawal(withdrawal_id, 'mock-admin');

    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Complete with mock transfer proof
    const bukti_transfer = `https://mock-bank.com/transfer/${Date.now()}.pdf`;
    await this.completeWithdrawal(withdrawal_id, bukti_transfer);

    console.log(`[WITHDRAWAL MOCK] Mock transfer completed for ${withdrawal_id}`);

    return await WithdrawalModel.findByPk(withdrawal_id);
  }

  /**
   * Convert Sequelize model to domain entity
   * @private
   */
  toEntity(withdrawalRecord) {
    return new Withdrawal({
      id: withdrawalRecord.id,
      escrow_id: withdrawalRecord.escrow_id,
      freelancer_id: withdrawalRecord.freelancer_id,
      metode_pembayaran_id: withdrawalRecord.metode_pembayaran_id,
      jumlah: parseFloat(withdrawalRecord.jumlah),
      biaya_platform: parseFloat(withdrawalRecord.biaya_platform),
      jumlah_bersih: parseFloat(withdrawalRecord.jumlah_bersih),
      metode_pencairan: withdrawalRecord.metode_pencairan,
      nomor_rekening: withdrawalRecord.nomor_rekening,
      nama_pemilik: withdrawalRecord.nama_pemilik,
      status: withdrawalRecord.status,
      bukti_transfer: withdrawalRecord.bukti_transfer,
      catatan: withdrawalRecord.catatan,
      dicairkan_pada: withdrawalRecord.dicairkan_pada,
      created_at: withdrawalRecord.created_at,
      updated_at: withdrawalRecord.updated_at
    });
  }
}

module.exports = WithdrawalService;
