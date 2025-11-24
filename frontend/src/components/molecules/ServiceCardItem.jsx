import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { favoriteService } from "../../services/favoriteService";
import { bookmarkService } from "../../services/bookmarkService";
import FavoriteToast from "./FavoriteToast";
import SavedToast from "./SavedToast";
import UnfavoriteConfirmModal from "./UnfavoriteConfirmModal";
import UnsaveConfirmModal from "./UnsaveConfirmModal";

export default function ServiceCardItem({ service, onClick, onFavoriteToggle, onBookmarkToggle, fullWidth = false }) {
  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  // Load initial favorite status from localStorage (legacy) - keep for UX; BE sync handled separately
  const getFavoriteStatus = () => {
    if (!user) return false;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(service.id);
  };

  // Initial saved status: rely on prop if provided (e.g., SavedPage), fallback to false
  const initialBookmarked = Boolean(service?.isSaved || service?.isBookmarked);

  const [isFavorite, setIsFavorite] = useState(getFavoriteStatus());
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [showUnfavoriteModal, setShowUnfavoriteModal] = useState(false);
  const [showUnbookmarkModal, setShowUnbookmarkModal] = useState(false);

  // Ensure initial bookmark state reflects server on refresh/navigation
  useEffect(() => {
    let cancelled = false;

    const hydrateBookmarkState = async () => {
      if (!user || !isClient || !service?.id) return;

      try {
        const res = await bookmarkService.isBookmarked(service.id);
        if (cancelled) return;
        if (res?.success && typeof res.data?.isBookmarked === 'boolean') {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (_) {
        // ignore - keep current optimistic state
      }
    };

    hydrateBookmarkState();
    return () => { cancelled = true; };
  }, [user, isClient, service?.id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!user || !isClient) {
      return; // Silent fail - better UX
    }

    // If unfavoriting, show confirmation modal
    if (isFavorite) {
      setShowUnfavoriteModal(true);
      return;
    }

    // Adding to favorites (no confirmation needed)
    setIsLoading(true);

    try {
      // Update localStorage immediately (offline-first)
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (!favorites.includes(service.id)) {
        favorites.push(service.id);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));

      // Update UI
      setIsFavorite(true);
      if (onFavoriteToggle) {
        onFavoriteToggle(service.id, true);
      }

      // Show toast notification
      setShowToast(true);

      // Sync to backend (optional, don't block UI)
      favoriteService.toggleFavorite(service.id, true).catch(err => {
        console.log("Backend sync failed:", err);
        // Keep localStorage state, don't revert
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmUnfavorite = async () => {
    setShowUnfavoriteModal(false);
    setIsLoading(true);

    try {
      // Update localStorage immediately (offline-first)
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const index = favorites.indexOf(service.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));

      // Update UI
      setIsFavorite(false);
      if (onFavoriteToggle) {
        onFavoriteToggle(service.id, false);
      }

      // Show toast notification
      setShowToast(true);

      // Sync to backend (optional, don't block UI)
      favoriteService.toggleFavorite(service.id, false).catch(err => {
        console.log("Backend sync failed:", err);
        // Keep localStorage state, don't revert
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    if (!user || !isClient) {
      return; // Silent fail - better UX
    }

    // Validate service ID
    if (!service?.id) {
      console.error("[ServiceCardItem] Invalid service ID:", service);
      alert('Gagal menyimpan bookmark: ID layanan tidak valid');
      return;
    }

    // If unsaving, show confirmation modal
    if (isBookmarked) {
      setShowUnbookmarkModal(true);
      return;
    }

    // Bookmarking (no confirmation needed)
    setIsBookmarkLoading(true);

    try {
      console.log("[ServiceCardItem] Attempting to bookmark service:", service.id);
      // Sync to backend bookmarks first
      const res = await bookmarkService.addBookmark(service.id);
      console.log("[ServiceCardItem] Bookmark response:", res);

      if (res?.success) {
        // Only update UI if backend confirms success
        setIsBookmarked(true);
        if (onBookmarkToggle) onBookmarkToggle(service.id, true);
        setShowBookmarkToast(true);
      } else {
        // Show error to user
        console.error("[ServiceCardItem] addBookmark failed:", res?.message);
        alert(`Gagal menyimpan bookmark: ${res?.message || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      console.error("[ServiceCardItem] addBookmark error:", error);
      alert(`Gagal menyimpan bookmark: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleConfirmUnbookmark = async () => {
    setShowUnbookmarkModal(false);
    setIsBookmarkLoading(true);

    try {
      // Sync to backend bookmarks first
      const res = await bookmarkService.removeBookmark(service.id);

      if (res?.success) {
        // Only update UI if backend confirms success
        setIsBookmarked(false);
        if (onBookmarkToggle) onBookmarkToggle(service.id, false);
        setShowBookmarkToast(true);
      } else {
        // Show error to user
        console.error("[ServiceCardItem] removeBookmark failed:", res?.message);
        alert(`Gagal menghapus bookmark: ${res?.message || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      console.error("[ServiceCardItem] removeBookmark error:", error);
      alert(`Gagal menghapus bookmark: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={`cursor-pointer group ${fullWidth ? 'w-full h-full' : 'flex-shrink-0 w-64'}`}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD]">
          <img
            src="/asset/layanan/Layanan.png"
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1D375B]">
              {service.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors">
            {service.title}
          </h3>

          {/* Freelancer Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]" />
            <span className="text-sm text-neutral-600">{service.freelancer}</span>
          </div>

          {/* Spacer to push content to bottom */}
          <div className="flex-1" />

          {/* Rating & Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-neutral-900">
                {service.rating}
              </span>
              <span className="text-sm text-neutral-500">
                ({service.reviews})
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-500">Mulai dari</div>
              <div className="text-lg font-bold text-[#4782BE]">
                Rp {service.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Favorite & Bookmark Icons - Only show for logged in clients */}
          {isClient && (
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin text-neutral-400 text-xl" />
                ) : (
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart ${isFavorite ? 'text-red-500' : 'text-neutral-400'} text-xl`} />
                )}
              </button>

              <button
                onClick={handleBookmarkClick}
                disabled={isBookmarkLoading}
                className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBookmarkLoading ? (
                  <i className="fas fa-spinner fa-spin text-neutral-400 text-xl" />
                ) : (
                  <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark ${isBookmarked ? 'text-neutral-900' : 'text-neutral-400'} text-xl`} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      </motion.div>

      {/* Toast Notifications */}
      <FavoriteToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        isFavorite={isFavorite}
      />

      <SavedToast
        isOpen={showBookmarkToast}
        onClose={() => setShowBookmarkToast(false)}
        isSaved={isBookmarked}
      />

      {/* Unfavorite Confirmation Modal */}
      <UnfavoriteConfirmModal
        isOpen={showUnfavoriteModal}
        onClose={() => setShowUnfavoriteModal(false)}
        onConfirm={handleConfirmUnfavorite}
        serviceName={service.title}
      />

      {/* Unbookmark Confirmation Modal */}
      <UnsaveConfirmModal
        isOpen={showUnbookmarkModal}
        onClose={() => setShowUnbookmarkModal(false)}
        onConfirm={handleConfirmUnbookmark}
        serviceName={service.title}
      />
    </>
  );
}
