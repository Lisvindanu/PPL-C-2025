/**
 * Recommendation Engine
 * Generates recommendations based on user's favorite categories
 */

import { getAllFavorites, getFavoriteIds } from './favoriteStorage';

/**
 * Analyze user's favorite categories
 * @param {Array} services - All services with category info
 * @returns {Object} Category statistics
 */
export function analyzeFavoriteCategories(services) {
  const favoriteIds = getFavoriteIds();

  if (favoriteIds.length === 0) {
    return {
      topCategories: [],
      categoryCount: {},
      totalFavorites: 0
    };
  }

  // Filter services that are favorited
  const favoritedServices = services.filter(s => favoriteIds.includes(s.id));

  // Count by category
  const categoryCount = {};
  favoritedServices.forEach(service => {
    const category = service.category || service.nama_kategori || 'Unknown';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  // Sort categories by count (descending)
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  return {
    topCategories,
    categoryCount,
    totalFavorites: favoriteIds.length
  };
}

/**
 * Get recommended services based on favorite categories
 * @param {Array} allServices - All available services
 * @param {Object} options - Recommendation options
 * @returns {Array} Recommended services
 */
export function getRecommendedServices(allServices, options = {}) {
  const {
    limit = 10,
    excludeFavorited = true,
    minRating = 0,
    sortBy = 'rating' // 'rating', 'price', 'reviews'
  } = options;

  const favoriteIds = getFavoriteIds();
  const analysis = analyzeFavoriteCategories(allServices);

  // If no favorites yet, return popular services
  if (analysis.totalFavorites === 0) {
    return allServices
      .filter(s => s.rating >= minRating)
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'reviews') return b.reviews - a.reviews;
        return 0;
      })
      .slice(0, limit);
  }

  // Get top 3 favorite categories
  const topCategories = analysis.topCategories
    .slice(0, 3)
    .map(c => c.category);

  // Filter services:
  // 1. From top favorite categories
  // 2. Not already favorited (if excludeFavorited = true)
  // 3. Meet minimum rating
  let recommendations = allServices.filter(service => {
    const category = service.category || service.nama_kategori || 'Unknown';
    const isInTopCategory = topCategories.includes(category);
    const isNotFavorited = !excludeFavorited || !favoriteIds.includes(service.id);
    const meetsRating = service.rating >= minRating;

    return isInTopCategory && isNotFavorited && meetsRating;
  });

  // Sort by specified criteria
  recommendations.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'reviews') return b.reviews - a.reviews;
    return 0;
  });

  // If not enough recommendations, fill with other high-rated services
  if (recommendations.length < limit) {
    const additionalServices = allServices
      .filter(s => {
        const notInRecommendations = !recommendations.find(r => r.id === s.id);
        const isNotFavorited = !excludeFavorited || !favoriteIds.includes(s.id);
        return notInRecommendations && isNotFavorited && s.rating >= minRating;
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit - recommendations.length);

    recommendations = [...recommendations, ...additionalServices];
  }

  return recommendations.slice(0, limit);
}

/**
 * Get recommendation reasons (why this service is recommended)
 * @param {Object} service - Service object
 * @param {Array} allServices - All services
 * @returns {Array<string>} Reasons
 */
export function getRecommendationReasons(service, allServices) {
  const reasons = [];
  const favoriteIds = getFavoriteIds();
  const analysis = analyzeFavoriteCategories(allServices);

  const serviceCategory = service.category || service.nama_kategori;
  const topCategory = analysis.topCategories[0];

  if (topCategory && serviceCategory === topCategory.category) {
    reasons.push(`Berdasarkan ${topCategory.count} favorit Anda di kategori ${topCategory.category}`);
  }

  if (service.rating >= 4.5) {
    reasons.push('Rating tinggi');
  }

  if (service.reviews >= 20) {
    reasons.push('Banyak ulasan positif');
  }

  if (service.total_pesanan >= 15) {
    reasons.push('Sering dipesan');
  }

  return reasons.length > 0 ? reasons : ['Populer di SkillConnect'];
}

/**
 * Get personalized greeting based on favorites
 * @param {Array} allServices - All services
 * @returns {string} Personalized greeting
 */
export function getPersonalizedGreeting(allServices) {
  const analysis = analyzeFavoriteCategories(allServices);

  if (analysis.totalFavorites === 0) {
    return 'Rekomendasi Untuk Anda';
  }

  if (analysis.totalFavorites === 1) {
    return 'Kami Menemukan Layanan yang Mungkin Anda Suka';
  }

  const topCategory = analysis.topCategories[0];
  if (topCategory) {
    return `Rekomendasi ${topCategory.category} Untuk Anda`;
  }

  return 'Rekomendasi Berdasarkan Favorit Anda';
}
