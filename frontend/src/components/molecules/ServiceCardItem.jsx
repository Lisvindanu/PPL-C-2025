import { motion } from "framer-motion";
import { useState, useEffect, useRef, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { favoriteService } from "../../services/favoriteService";
import { bookmarkService } from "../../services/bookmarkService";
import { isFavorited, addFavorite as addFavoriteToStorage, removeFavorite as removeFavoriteFromStorage } from "../../utils/favoriteStorage";
import FavoriteToast from "./FavoriteToast";
import SavedToast from "./SavedToast";
import UnfavoriteConfirmModal from "./UnfavoriteConfirmModal";
import UnsaveConfirmModal from "./UnsaveConfirmModal";
import RecommendationPopup from "./RecommendationPopup";

export default function ServiceCardItem({
  service,
  onClick,
  onFavoriteToggle,
  onBookmarkToggle,
  fullWidth = false,
}) {
  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  const getFavoriteStatus = () => {
    if (!user) return false;
    return isFavorited(service.id);
  };

  // Initial saved status: rely on prop if provided (e.g., SavedPage), fallback to false
  const initialBookmarked = Boolean(service?.isSaved || service?.isBookmarked);

  const [isFavorite, setIsFavorite] = useState(getFavoriteStatus());
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [showToast, setShowToast] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [showUnfavoriteModal, setShowUnfavoriteModal] = useState(false);
  const [showUnbookmarkModal, setShowUnbookmarkModal] = useState(false);
  const [pendingBookmarkOperation, setPendingBookmarkOperation] = useState(false);
  const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(service.favoriteCount || 0);
  const hasHydratedRef = useRef(false);

  // Ensure initial bookmark state reflects server on refresh/navigation
  // Only hydrate ONCE on mount, don't re-run on every render
  useEffect(() => {
    let cancelled = false;

    const hydrateBookmarkState = async () => {
      if (!user || !isClient || !service?.id) return;

      // Only hydrate once per service
      if (hasHydratedRef.current) {
        console.log('[ServiceCardItem] Already hydrated, skipping');
        return;
      }

      // Don't override state if there's a pending optimistic operation
      if (pendingBookmarkOperation) {
        console.log('[ServiceCardItem] Skipping hydration - pending operation');
        return;
      }

      try {
        console.log('[ServiceCardItem] Hydrating bookmark state for:', service.id);
        const res = await bookmarkService.isBookmarked(service.id);
        if (cancelled) return;
        if (res?.success && typeof res.data?.isBookmarked === "boolean") {
          console.log('[ServiceCardItem] Hydrated bookmark state:', res.data.isBookmarked);
          setIsBookmarked(res.data.isBookmarked);
          hasHydratedRef.current = true;
        }
      } catch (_) {
        // ignore - keep current optimistic state
      }
    };

    hydrateBookmarkState();
    return () => {
      cancelled = true;
    };
  }, [user, isClient, service?.id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('[ServiceCardItem] handleFavoriteClick called', {
      serviceId: service.id,
      user: !!user,
      isClient,
      isFavorite
    });

    if (!user || !isClient) {
      console.warn('[ServiceCardItem] User not logged in or not a client');
      return; // Silent fail - better UX
    }

    // If unfavoriting, show confirmation modal
    if (isFavorite) {
      console.log('[ServiceCardItem] Already favorited, showing unfavorite modal');
      setShowUnfavoriteModal(true);
      return;
    }

    // Adding to favorites - INSTANT UPDATE with startTransition
    startTransition(() => {
      try {
        console.log('[ServiceCardItem] Adding to favorites, service ID:', service.id);

        // Update localStorage immediately using utility (offline-first)
        addFavoriteToStorage(service.id);

        // Update UI instantly
        setIsFavorite(true);
        setFavoriteCount(prev => prev + 1); // Optimistic increment
        if (onFavoriteToggle) {
          onFavoriteToggle(service.id, true);
        }

        // Show toast notification
        setShowToast(true);

        // Show recommendation popup after short delay - TEMPORARILY HIDDEN
        // setTimeout(() => {
        //   setShowRecommendationPopup(true);
        // }, 500);

        // Sync to backend in background (don't block UI)
        favoriteService.toggleFavorite(service.id, true).then((result) => {
          if (!result.success) {
            console.error("[ServiceCardItem] Backend favorite sync failed:", result.message);

            // If service not found in backend, revert the favorite
            if (result.message?.includes('tidak ditemukan') || result.message?.includes('not found')) {
              console.warn('[ServiceCardItem] Service not found in backend, reverting favorite');
              setIsFavorite(false);
              removeFavoriteFromStorage(service.id);

              // Show error toast
              alert('Layanan tidak ditemukan di server. Silakan refresh halaman.');
            }
          } else {
            console.log('[ServiceCardItem] Backend favorite synced successfully');
          }
        });
      } catch (error) {
        console.error("[ServiceCardItem] Error adding favorite:", error);
      }
    });
  };

  const handleConfirmUnfavorite = () => {
    setShowUnfavoriteModal(false);

    startTransition(() => {
      try {
        // Update localStorage immediately using utility (offline-first)
        removeFavoriteFromStorage(service.id);

        // Update UI instantly
        setIsFavorite(false);
        setFavoriteCount(prev => Math.max(0, prev - 1)); // Optimistic decrement (don't go below 0)
        if (onFavoriteToggle) {
          onFavoriteToggle(service.id, false);
        }

        // Show toast notification
        setShowToast(true);

        // Sync to backend in background (don't block UI)
        favoriteService.toggleFavorite(service.id, false).catch((err) => {
          console.log("Backend sync failed:", err);
          // Keep localStorage state, don't revert
        });
      } catch (error) {
        console.error("Error:", error);
      }
    });
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('[ServiceCardItem] ========== BOOKMARK CLICK ==========');
    console.log('[ServiceCardItem] handleBookmarkClick called', {
      serviceId: service.id,
      user: !!user,
      isClient,
      isBookmarked
    });
    console.trace('[ServiceCardItem] Bookmark click trace');

    if (!user || !isClient) {
      console.warn('[ServiceCardItem] User not logged in or not a client');
      return; // Silent fail - better UX
    }

    // If unsaving, show confirmation modal
    if (isBookmarked) {
      console.log('[ServiceCardItem] Already bookmarked, showing unbookmark modal');
      setShowUnbookmarkModal(true);
      return;
    }

    // Bookmarking - INSTANT UPDATE (no loading state)
    console.log('[ServiceCardItem] Adding bookmark, service ID:', service.id);

    // Mark operation as pending to prevent hydration override
    setPendingBookmarkOperation(true);

    // Optimistic UI update immediately
    setIsBookmarked(true);
    if (onBookmarkToggle) onBookmarkToggle(service.id, true);
    setShowBookmarkToast(true);

    // Sync to backend in background (don't block UI)
    bookmarkService.addBookmark(service.id)
      .then((res) => {
        console.log('[ServiceCardItem] addBookmark response:', res);
        if (!res?.success) {
          // Revert if failed
          console.error('[ServiceCardItem] Bookmark failed, reverting');
          setIsBookmarked(false);
          if (onBookmarkToggle) onBookmarkToggle(service.id, false);
        } else {
          console.log('[ServiceCardItem] Bookmark success!');
        }
      })
      .catch((error) => {
        console.error("[ServiceCardItem] addBookmark error:", error);
        // Revert on error
        setIsBookmarked(false);
        if (onBookmarkToggle) onBookmarkToggle(service.id, false);
      })
      .finally(() => {
        // Clear pending flag after operation completes
        setPendingBookmarkOperation(false);
      });
  };

  const handleConfirmUnbookmark = () => {
    setShowUnbookmarkModal(false);

    // Mark operation as pending to prevent hydration override
    setPendingBookmarkOperation(true);

    // Optimistic UI update immediately
    setIsBookmarked(false);
    if (onBookmarkToggle) onBookmarkToggle(service.id, false);
    setShowBookmarkToast(true);

    // Sync to backend in background (don't block UI)
    bookmarkService.removeBookmark(service.id)
      .then((res) => {
        if (!res?.success) {
          // Revert if failed
          setIsBookmarked(true);
          if (onBookmarkToggle) onBookmarkToggle(service.id, true);
        }
      })
      .catch((error) => {
        console.error("[ServiceCardItem] removeBookmark error:", error);
        // Revert on error
        setIsBookmarked(true);
        if (onBookmarkToggle) onBookmarkToggle(service.id, true);
      })
      .finally(() => {
        // Clear pending flag after operation completes
        setPendingBookmarkOperation(false);
      });
  };

  const thumbnailSrc = service.thumbnail || "/asset/layanan/Layanan.png";

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={`group ${
          fullWidth ? "w-full" : "flex-shrink-0 w-64"
        }`}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Image */}
          <div
            className="relative h-40 overflow-hidden bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] cursor-pointer"
            onClick={onClick}
          >
            <img
              src={thumbnailSrc}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3 max-w-[140px]">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1D375B] truncate inline-block max-w-full">
                {service.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-4">
            <h3
              className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors cursor-pointer"
              onClick={onClick}
            >
              {service.title}
            </h3>

            {/* Freelancer Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]" />
              <span className="text-sm text-neutral-600">
                {service.freelancer}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <i className="fas fa-star text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-neutral-900">
                {service.rating}
              </span>
              <span className="text-sm text-neutral-500">
                ({service.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="text-xs text-neutral-500 mb-1">Mulai dari</div>
              <div className="text-lg font-bold text-[#4782BE]">
                Rp {service.price.toLocaleString("id-ID")}
              </div>
            </div>

            {/* Bottom Row: Favorite Count & Bookmark Icon */}
            <div className="flex items-center justify-between">
              {/* Favorite Section - Bottom Left */}
              <div className="flex items-center gap-2">
                {/* Favorite Button - Always show as red solid heart */}
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  disabled={!isClient}
                  className={`flex items-center justify-center transition-all ${
                    isClient ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"
                  }`}
                  aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
                  title={!isClient ? "Login untuk menyukai layanan" : (isFavorite ? "Hapus dari favorit" : "Tambah ke favorit")}
                >
                  <i
                    className="fas fa-heart text-red-500 text-3xl transition-all duration-200 pointer-events-none"
                  />
                </button>
                {/* Favorite Count - Always show */}
                <div className="flex items-center gap-1 pointer-events-none" title={`${favoriteCount} orang menyukai layanan ini`}>
                  <span className="text-sm font-medium text-neutral-700">
                    {favoriteCount}
                  </span>
                </div>
              </div>

              {/* Bookmark Icon - Bottom Right - Always show in default state if not logged in */}
              <button
                type="button"
                onClick={handleBookmarkClick}
                disabled={!isClient}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  isClient ? "hover:bg-neutral-100 cursor-pointer" : "cursor-not-allowed"
                }`}
                aria-label="Simpan layanan"
                title={!isClient ? "Login untuk menyimpan layanan" : (isBookmarked ? "Hapus dari simpanan" : "Simpan layanan")}
              >
                <i
                  className={`${isClient && isBookmarked ? "fas" : "far"} fa-bookmark ${
                    isClient && isBookmarked ? "text-neutral-900" : "text-neutral-600"
                  } text-3xl transition-all duration-200 pointer-events-none`}
                />
              </button>
            </div>
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
      {/* Recommendation Popup - Shows after favoriting */}
      <RecommendationPopup
        isOpen={showRecommendationPopup}
        onClose={() => setShowRecommendationPopup(false)}
        currentService={service}
      />
    </>
  );
}
