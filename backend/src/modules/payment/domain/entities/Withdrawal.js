/**
 * Withdrawal Entity (Pencairan Dana)
 * Domain entity untuk pencairan dana freelancer
 */

class Withdrawal {
  constructor({
    id,
    escrow_id,
    freelancer_id,
    metode_pembayaran_id,
    jumlah,
    biaya_platform,
    jumlah_bersih,
    metode_pencairan,
    nomor_rekening,
    nama_pemilik,
    status,
    bukti_transfer,
    catatan,
    dicairkan_pada,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.escrow_id = escrow_id;
    this.freelancer_id = freelancer_id;
    this.metode_pembayaran_id = metode_pembayaran_id;
    this.jumlah = jumlah;
    this.biaya_platform = biaya_platform || 0;
    this.jumlah_bersih = jumlah_bersih;
    this.metode_pencairan = metode_pencairan;
    this.nomor_rekening = nomor_rekening;
    this.nama_pemilik = nama_pemilik;
    this.status = status || 'pending';
    this.bukti_transfer = bukti_transfer;
    this.catatan = catatan;
    this.dicairkan_pada = dicairkan_pada;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Calculate net amount after platform fee
   */
  static calculateNetAmount(grossAmount, platformFeePercentage = 0.05) {
    const platformFee = grossAmount * platformFeePercentage;
    return {
      jumlah: grossAmount,
      biaya_platform: platformFee,
      jumlah_bersih: grossAmount - platformFee
    };
  }

  /**
   * Mark withdrawal as processing
   */
  startProcessing() {
    if (this.status !== 'pending') {
      throw new Error('Can only process pending withdrawals');
    }
    this.status = 'processing';
  }

  /**
   * Complete withdrawal
   */
  complete(buktiTransfer) {
    if (this.status !== 'processing') {
      throw new Error('Can only complete withdrawals that are processing');
    }
    this.status = 'completed';
    this.dicairkan_pada = new Date();
    this.bukti_transfer = buktiTransfer;
  }

  /**
   * Fail withdrawal
   */
  fail(reason) {
    if (this.status === 'completed') {
      throw new Error('Cannot fail completed withdrawals');
    }
    this.status = 'failed';
    this.catatan = reason;
  }

  /**
   * Check if withdrawal is pending
   */
  isPending() {
    return this.status === 'pending';
  }

  /**
   * Check if withdrawal is processing
   */
  isProcessing() {
    return this.status === 'processing';
  }

  /**
   * Check if withdrawal is completed
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if withdrawal is failed
   */
  isFailed() {
    return this.status === 'failed';
  }

  /**
   * Get transfer details
   */
  getTransferDetails() {
    return {
      metode: this.metode_pencairan,
      nomor_rekening: this.nomor_rekening,
      nama_pemilik: this.nama_pemilik,
      jumlah: this.jumlah,
      biaya_platform: this.biaya_platform,
      jumlah_bersih: this.jumlah_bersih
    };
  }

  /**
   * Validate withdrawal data
   */
  validate() {
    const errors = [];

    if (!this.escrow_id) errors.push('escrow_id is required');
    if (!this.freelancer_id) errors.push('freelancer_id is required');
    if (!this.jumlah || this.jumlah <= 0) errors.push('jumlah must be greater than 0');
    if (!this.jumlah_bersih || this.jumlah_bersih <= 0) {
      errors.push('jumlah_bersih must be greater than 0');
    }
    if (!this.metode_pencairan) errors.push('metode_pencairan is required');
    if (!['transfer_bank', 'e_wallet'].includes(this.metode_pencairan)) {
      errors.push('metode_pencairan must be either transfer_bank or e_wallet');
    }
    if (!this.nomor_rekening) errors.push('nomor_rekening is required');
    if (!this.nama_pemilik) errors.push('nama_pemilik is required');

    const validStatuses = ['pending', 'processing', 'completed', 'failed'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(`Withdrawal validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

module.exports = Withdrawal;
