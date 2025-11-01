/**
 * Get Personalized Recommendations Use Case
 *
 * Ini modul yang paling menarik! Machine Learning sederhana untuk rekomendasi.
 * Ga perlu ML library yang ribet, collaborative filtering manual juga cukup.
 *
 * Algoritma yang bisa dipakai:
 * 1. Content-Based: Rekomendasikan service serupa dengan yang pernah di-order
 * 2. Collaborative Filtering: "User yang order X juga order Y"
 * 3. Popularity-Based: Service dengan rating tertinggi di kategori favorit
 * 4. Location-Based: Service terdekat dengan lokasi user
 *
 * Steps implementasi:
 * 1. Ambil user preferences dari order history
 * 2. Identifikasi kategori dan keywords favorit
 * 3. Score services berdasarkan similarity
 * 4. Return top N recommendations
 *
 * Bonus: Tambahkan diversity - jangan rekomendasiin kategori yang sama semua
 */

class GetPersonalizedRecommendations {
  constructor(
    recommendationRepository,
    orderRepository,
    serviceRepository
  ) {
    this.recommendationRepository = recommendationRepository;
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
  }

  async execute(userId, options = {}) {
    // options: { limit, excludeOrdered, minRating }

    // TODO: Ambil order history user
    // const orderHistory = await this.orderRepository.findByUserId(userId, {
    //   limit: 50, // Cukup 50 order terakhir
    //   includeService: true
    // });

    // TODO: Identifikasi preferences
    // const preferences = this.analyzePreferences(orderHistory);
    // // preferences: { kategori_ids, sub_kategori_ids, price_range, keywords }

    // TODO: Get candidate services
    // const candidates = await this.serviceRepository.findAll({
    //   kategori_id: preferences.kategori_ids,
    //   status: 'active',
    //   rating_min: options.minRating || 3.5
    // });

    // TODO: Filter out already ordered (optional)
    // if (options.excludeOrdered) {
    //   const orderedServiceIds = orderHistory.map(o => o.layanan_id);
    //   candidates = candidates.filter(s => !orderedServiceIds.includes(s.id));
    // }

    // TODO: Score and rank
    // const scored = candidates.map(service => ({
    //   ...service,
    //   score: this.calculateRecommendationScore(service, preferences)
    // }));
    //
    // scored.sort((a, b) => b.score - a.score);

    // TODO: Return top N
    // return scored.slice(0, options.limit || 10);

    throw new Error('Not implemented yet - Ini modul advanced, tapi menarik untuk dipelajari!');
  }

  /**
   * Analyze user preferences from order history
   */
  analyzePreferences(orderHistory) {
    // TODO: Extract patterns
    // - Most ordered kategori/sub_kategori
    // - Average price range
    // - Common keywords in service titles
    // - Preferred locations
  }

  /**
   * Calculate recommendation score (0-100)
   *
   * Factors:
   * - Category match (30 points)
   * - Price match (20 points)
   * - Rating (25 points)
   * - Popularity/total orders (15 points)
   * - Location proximity (10 points)
   */
  calculateRecommendationScore(service, preferences) {
    // TODO: Implement scoring algorithm
    let score = 0;

    // Category match
    // if (preferences.kategori_ids.includes(service.kategori_id)) score += 30;

    // Price match
    // if (service.harga_minimum >= preferences.price_range.min &&
    //     service.harga_maksimum <= preferences.price_range.max) score += 20;

    // Rating
    // score += (service.rating_rata_rata / 5) * 25;

    // Popularity
    // score += Math.min((service.total_pesanan / 100) * 15, 15);

    return score;
  }
}

module.exports = GetPersonalizedRecommendations;
