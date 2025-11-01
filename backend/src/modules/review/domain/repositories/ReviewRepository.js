/**
 * Review Repository Interface
 *
 * Contract buat operasi database review.
 * Jangan lupa bikin index di kolom layanan_id sama user_id biar query cepet.
 */

class ReviewRepository {
  /**
   * Create review baru
   */
  async create(reviewData) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Cari review by ID
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Cari review by order ID
   * Buat validasi user belum pernah review order ini
   */
  async findByOrderId(orderId) {
    throw new Error('Method findByOrderId() must be implemented');
  }

  /**
   * Cari semua review untuk service tertentu
   * Include pagination dan filter rating
   *
   * filters: { rating, page, limit, sortBy: 'newest'|'highest'|'lowest'|'helpful' }
   */
  async findByServiceId(serviceId, filters = {}) {
    throw new Error('Method findByServiceId() must be implemented');
  }

  /**
   * Cari semua review yang dibuat user
   */
  async findByUserId(userId, filters = {}) {
    throw new Error('Method findByUserId() must be implemented');
  }

  /**
   * Hitung average rating dan jumlah review untuk service
   * Return: { newAverage, reviewCount }
   *
   * Query example:
   * SELECT AVG(rating) as avg, COUNT(*) as count
   * FROM review
   * WHERE layanan_id = ?
   */
  async calculateAverageRating(serviceId) {
    throw new Error('Method calculateAverageRating() must be implemented - Ini penting banget');
  }

  /**
   * Update review (buat edit atau tambah balasan)
   */
  async update(id, reviewData) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Delete review
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Increment helpful counter
   */
  async incrementHelpful(id) {
    throw new Error('Method incrementHelpful() must be implemented');
  }

  /**
   * Get rating distribution untuk service
   * Return: { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
   *
   * Buat nampilin chart distribusi rating
   */
  async getRatingDistribution(serviceId) {
    throw new Error('Method getRatingDistribution() must be implemented');
  }
}

module.exports = ReviewRepository;
