/**
 * Payment Entity
 * Domain entity untuk pembayaran
 */

class Payment {
  constructor({
    id,
    pesanan_id,
    user_id,
    transaction_id,
    external_id,
    jumlah,
    biaya_platform,
    biaya_payment_gateway,
    total_bayar,
    metode_pembayaran,
    channel,
    payment_gateway,
    payment_url,
    status,
    callback_data,
    callback_signature,
    nomor_invoice,
    invoice_url,
    dibayar_pada,
    kadaluarsa_pada,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.pesanan_id = pesanan_id;
    this.user_id = user_id;
    this.transaction_id = transaction_id;
    this.external_id = external_id;
    this.jumlah = jumlah;
    this.biaya_platform = biaya_platform || 0;
    this.biaya_payment_gateway = biaya_payment_gateway || 0;
    this.total_bayar = total_bayar;
    this.metode_pembayaran = metode_pembayaran;
    this.channel = channel;
    this.payment_gateway = payment_gateway;
    this.payment_url = payment_url;
    this.status = status || 'menunggu';
    this.callback_data = callback_data;
    this.callback_signature = callback_signature;
    this.nomor_invoice = nomor_invoice;
    this.invoice_url = invoice_url;
    this.dibayar_pada = dibayar_pada;
    this.kadaluarsa_pada = kadaluarsa_pada;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Mark payment as successful
   */
  markAsPaid() {
    this.status = 'berhasil';
    this.dibayar_pada = new Date();
  }

  /**
   * Mark payment as failed
   */
  markAsFailed() {
    this.status = 'gagal';
  }

  /**
   * Mark payment as expired
   */
  markAsExpired() {
    this.status = 'kadaluarsa';
  }

  /**
   * Check if payment is successful
   */
  isSuccessful() {
    return this.status === 'berhasil';
  }

  /**
   * Check if payment is pending
   */
  isPending() {
    return this.status === 'menunggu';
  }

  /**
   * Generate invoice number
   */
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const uniqueId = this.id.substr(0, 8).toUpperCase();
    this.nomor_invoice = `INV/${year}/${month}/${uniqueId}`;
    return this.nomor_invoice;
  }

  /**
   * Calculate expiry time (24 hours from now)
   */
  setExpiryTime(hours = 24) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hours);
    this.kadaluarsa_pada = expiryDate;
  }

  /**
   * Validate payment data
   */
  validate() {
    const errors = [];

    if (!this.pesanan_id) errors.push('pesanan_id is required');
    if (!this.user_id) errors.push('user_id is required');
    if (!this.transaction_id) errors.push('transaction_id is required');
    if (!this.jumlah || this.jumlah <= 0) errors.push('jumlah must be greater than 0');
    if (!this.total_bayar || this.total_bayar <= 0) errors.push('total_bayar must be greater than 0');
    if (!this.metode_pembayaran) errors.push('metode_pembayaran is required');
    if (!this.payment_gateway) errors.push('payment_gateway is required');

    if (errors.length > 0) {
      throw new Error(`Payment validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

module.exports = Payment;
