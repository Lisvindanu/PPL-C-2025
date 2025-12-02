/**
 * Version checker to force browser reload when code is updated
 * This ensures users always get the latest frontend code
 */

// IMPORTANT: Increment this version number whenever you make changes
// that need to force a browser reload (like removing mock data)
const CURRENT_VERSION = '2.5.6'; // Force clear ALL recommendation caches including v9

export const checkVersion = () => {
  const storedVersion = sessionStorage.getItem('app_version');
  const reloadAttempt = sessionStorage.getItem('reload_attempt');

  if (storedVersion !== CURRENT_VERSION) {
    // Prevent infinite reload loop
    if (reloadAttempt === CURRENT_VERSION) {
      console.error(`[VersionChecker] Reload failed, but preventing infinite loop`);
      sessionStorage.setItem('app_version', CURRENT_VERSION);
      return;
    }

    console.warn(`[VersionChecker] Version mismatch detected!`);
    console.warn(`[VersionChecker] Stored: ${storedVersion}, Current: ${CURRENT_VERSION}`);
    console.warn(`[VersionChecker] Forcing full cache clear and reload...`);

    // Mark that we're attempting a reload for this version
    sessionStorage.setItem('reload_attempt', CURRENT_VERSION);

    // Clear service worker caches if they exist
    if ('caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
    }

    // Clear old favorites from localStorage (but preserve reload_attempt)
    // Note: This clears the old 'favorites' key - new system uses 'favorites_v2'
    localStorage.removeItem('favorites');

    // Clear ALL recommendation caches (v8, v9, etc.)
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('cachedRecommendations')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      console.log(`[VersionChecker] Removing cache: ${key}`);
      sessionStorage.removeItem(key);
    });

    // Clear all other sessionStorage except reload_attempt
    const reloadAttemptValue = sessionStorage.getItem('reload_attempt');
    sessionStorage.clear();
    sessionStorage.setItem('reload_attempt', reloadAttemptValue);

    // Force hard reload
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  } else {
    console.log(`[VersionChecker] Version OK: ${CURRENT_VERSION}`);
    // Clear reload attempt flag on successful load
    sessionStorage.removeItem('reload_attempt');
    sessionStorage.setItem('app_version', CURRENT_VERSION);
  }
};
