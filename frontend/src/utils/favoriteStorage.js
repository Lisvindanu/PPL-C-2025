/**
 * Favorite Storage Utility
 * Manages favorites with timestamp (like Shopee)
 *
 * Structure: Array of objects
 * [
 *   { serviceId: "uuid", timestamp: "2025-11-26T10:00:00Z" },
 *   { serviceId: "uuid2", timestamp: "2025-11-26T09:30:00Z" }
 * ]
 */

const FAVORITES_KEY = 'favorites_v2'; // New key to avoid conflicts
const LEGACY_KEY = 'favorites'; // Old key for migration

/**
 * Migrate old favorites (array of IDs) to new format (array of objects with timestamp)
 */
function migrateLegacyFavorites() {
  try {
    const legacyData = localStorage.getItem(LEGACY_KEY);
    const newData = localStorage.getItem(FAVORITES_KEY);

    // Only migrate if legacy exists and new doesn't
    if (legacyData && !newData) {
      const legacyIds = JSON.parse(legacyData);
      if (Array.isArray(legacyIds) && legacyIds.length > 0) {
        const now = new Date().toISOString();
        const migrated = legacyIds.map(id => ({
          serviceId: id,
          timestamp: now // All legacy favorites get same timestamp
        }));
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated));
        console.log('[FavoriteStorage] Migrated', legacyIds.length, 'legacy favorites');
      }
    }
  } catch (error) {
    console.error('[FavoriteStorage] Migration error:', error);
  }
}

/**
 * Get all favorites with timestamps
 * @returns {Array<{serviceId: string, timestamp: string}>}
 */
export function getAllFavorites() {
  try {
    migrateLegacyFavorites();
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[FavoriteStorage] Error getting favorites:', error);
    return [];
  }
}

/**
 * Check if a service is favorited
 * @param {string} serviceId
 * @returns {boolean}
 */
export function isFavorited(serviceId) {
  const favorites = getAllFavorites();
  return favorites.some(fav => fav.serviceId === serviceId);
}

/**
 * Get favorite timestamp
 * @param {string} serviceId
 * @returns {string|null} ISO timestamp or null
 */
export function getFavoriteTimestamp(serviceId) {
  const favorites = getAllFavorites();
  const favorite = favorites.find(fav => fav.serviceId === serviceId);
  return favorite ? favorite.timestamp : null;
}

/**
 * Add a service to favorites
 * @param {string} serviceId
 * @returns {boolean} success
 */
export function addFavorite(serviceId) {
  try {
    const favorites = getAllFavorites();

    // Check if already exists
    const exists = favorites.some(fav => fav.serviceId === serviceId);
    if (exists) {
      console.log('[FavoriteStorage] Already favorited:', serviceId);
      return true;
    }

    // Add new favorite with timestamp
    favorites.push({
      serviceId,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    // Trigger custom event for same tab
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites, serviceId, action: 'add' }
    }));

    console.log('[FavoriteStorage] Added favorite:', serviceId);
    return true;
  } catch (error) {
    console.error('[FavoriteStorage] Error adding favorite:', error);
    return false;
  }
}

/**
 * Remove a service from favorites
 * @param {string} serviceId
 * @returns {boolean} success
 */
export function removeFavorite(serviceId) {
  try {
    const favorites = getAllFavorites();
    const filtered = favorites.filter(fav => fav.serviceId !== serviceId);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));

    // Trigger custom event for same tab
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites: filtered, serviceId, action: 'remove' }
    }));

    console.log('[FavoriteStorage] Removed favorite:', serviceId);
    return true;
  } catch (error) {
    console.error('[FavoriteStorage] Error removing favorite:', error);
    return false;
  }
}

/**
 * Get favorite IDs only (for backward compatibility)
 * @returns {Array<string>}
 */
export function getFavoriteIds() {
  const favorites = getAllFavorites();
  return favorites.map(fav => fav.serviceId);
}

/**
 * Get favorites sorted by timestamp (newest first)
 * @returns {Array<{serviceId: string, timestamp: string}>}
 */
export function getFavoritesSortedByTime() {
  const favorites = getAllFavorites();
  return favorites.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Clear all favorites
 */
export function clearAllFavorites() {
  localStorage.removeItem(FAVORITES_KEY);
  localStorage.removeItem(LEGACY_KEY);
  console.log('[FavoriteStorage] Cleared all favorites');
}
