/**
 * Get Similar Services Use Case
 *
 * Recommend services yang mirip dengan service tertentu.
 * Berguna untuk "Lihat Juga" atau "Service Serupa" section.
 *
 * Similarity factors:
 * 1. Same kategori/sub_kategori (high weight)
 * 2. Similar price range (medium weight)
 * 3. Similar keywords in title/description (medium weight)
 * 4. Same location/area (low weight)
 *
 * Algorithm: Cosine similarity atau simple weighted scoring
 *
 * Steps:
 * 1. Get source service details
 * 2. Find services dalam kategori yang sama
 * 3. Calculate similarity score
 * 4. Sort by score DESC
 * 5. Return top N (exclude source service)
 */

class GetSimilarServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId, options = {}) {
    // options: { limit, minRating }

    // TODO: Get source service
    // const sourceService = await this.serviceRepository.findById(serviceId);
    // if (!sourceService) {
    //   throw new Error('Service not found');
    // }

    // TODO: Get candidates - services in same sub_kategori
    // const candidates = await this.serviceRepository.findAll({
    //   sub_kategori_id: sourceService.sub_kategori_id,
    //   status: 'active',
    //   rating_min: options.minRating || 3.0
    // });

    // TODO: Filter out source service
    // const filtered = candidates.filter(s => s.id !== serviceId);

    // TODO: Calculate similarity scores
    // const scored = filtered.map(service => ({
    //   ...service,
    //   similarity_score: this.calculateSimilarity(sourceService, service)
    // }));

    // TODO: Sort by similarity
    // scored.sort((a, b) => b.similarity_score - a.similarity_score);

    // TODO: Return top N
    // return scored.slice(0, options.limit || 5);

    throw new Error('Not implemented yet - Use case ini relatif simple, cocok untuk latihan!');
  }

  /**
   * Calculate similarity between two services (0-1)
   */
  calculateSimilarity(source, target) {
    let score = 0;

    // TODO: Sub-kategori match (already filtered, so +0.3)
    // score += 0.3;

    // TODO: Price similarity (0-0.3)
    // const priceDiff = Math.abs(source.harga_minimum - target.harga_minimum);
    // const maxPrice = Math.max(source.harga_minimum, target.harga_minimum);
    // const priceSimilarity = 1 - (priceDiff / maxPrice);
    // score += priceSimilarity * 0.3;

    // TODO: Title similarity (0-0.2)
    // Use simple keyword matching or Levenshtein distance
    // const titleSimilarity = this.calculateTextSimilarity(source.judul, target.judul);
    // score += titleSimilarity * 0.2;

    // TODO: Location similarity (0-0.2)
    // if (source.lokasi === target.lokasi) score += 0.2;

    return score;
  }

  /**
   * Calculate text similarity using keyword overlap
   * (Simple implementation, bisa diganti dengan TF-IDF)
   */
  calculateTextSimilarity(text1, text2) {
    // TODO: Tokenize and compare
    // const tokens1 = text1.toLowerCase().split(/\s+/);
    // const tokens2 = text2.toLowerCase().split(/\s+/);
    //
    // const intersection = tokens1.filter(t => tokens2.includes(t));
    // const union = [...new Set([...tokens1, ...tokens2])];
    //
    // return intersection.length / union.length;

    return 0;
  }
}

module.exports = GetSimilarServices;
