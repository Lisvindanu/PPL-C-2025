/**
 * Escrow Entity
 * Domain entity untuk escrow (penahan dana)
 */

class Escrow {
  constructor({
    id,
    pembayaran_id,
    pesanan_id,
    jumlah_ditahan,
    biaya_platform,
    status,
    ditahan_pada,
    akan_dirilis_pada,
    dirilis_pada,
    alasan,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.pembayaran_id = pembayaran_id;
    this.pesanan_id = pesanan_id;
    this.jumlah_ditahan = jumlah_ditahan;
    this.biaya_platform = biaya_platform || 0;
    this.status = status || 'held';
    this.ditahan_pada = ditahan_pada;
    this.akan_dirilis_pada = akan_dirilis_pada;
    this.dirilis_pada = dirilis_pada;
    this.alasan = alasan;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Hold payment in escrow
   */
  hold() {
    this.status = 'held';
    this.ditahan_pada = new Date();
  }

  /**
   * Release payment from escrow
   */
  release() {
    if (this.status !== 'held') {
      throw new Error('Cannot release escrow that is not held');
    }
    this.status = 'released';
    this.dirilis_pada = new Date();
  }

  /**
   * Refund payment from escrow
   */
  refund(reason) {
    if (this.status !== 'held') {
      throw new Error('Cannot refund escrow that is not held');
    }
    this.status = 'refunded';
    this.dirilis_pada = new Date();
    this.alasan = reason;
  }

  /**
   * Mark as disputed
   */
  markAsDisputed() {
    this.status = 'disputed';
  }

  /**
   * Partial release (untuk kasus dispute)
   */
  partialRelease(amount, reason) {
    if (this.status !== 'held' && this.status !== 'disputed') {
      throw new Error('Cannot partially release escrow');
    }
    if (amount > this.jumlah_ditahan) {
      throw new Error('Partial release amount exceeds held amount');
    }
    this.status = 'partial_released';
    this.dirilis_pada = new Date();
    this.alasan = reason;
  }

  /**
   * Complete escrow process
   */
  complete() {
    this.status = 'completed';
  }

  /**
   * Set automatic release date (default: 7 days from now)
   */
  setAutoReleaseDate(days = 7) {
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + days);
    this.akan_dirilis_pada = releaseDate;
  }

  /**
   * Check if auto-release date has passed
   */
  shouldAutoRelease() {
    if (!this.akan_dirilis_pada || this.status !== 'held') {
      return false;
    }
    return new Date() >= this.akan_dirilis_pada;
  }

  /**
   * Calculate net amount (after platform fee)
   */
  getNetAmount() {
    return this.jumlah_ditahan - this.biaya_platform;
  }

  /**
   * Check if escrow is held
   */
  isHeld() {
    return this.status === 'held';
  }

  /**
   * Check if escrow is released
   */
  isReleased() {
    return this.status === 'released' || this.status === 'completed';
  }

  /**
   * Check if escrow is refunded
   */
  isRefunded() {
    return this.status === 'refunded';
  }

  /**
   * Validate escrow data
   */
  validate() {
    const errors = [];

    if (!this.pembayaran_id) errors.push('pembayaran_id is required');
    if (!this.pesanan_id) errors.push('pesanan_id is required');
    if (!this.jumlah_ditahan || this.jumlah_ditahan <= 0) {
      errors.push('jumlah_ditahan must be greater than 0');
    }

    const validStatuses = ['held', 'released', 'refunded', 'disputed', 'partial_released', 'completed'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(`Escrow validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

module.exports = Escrow;
