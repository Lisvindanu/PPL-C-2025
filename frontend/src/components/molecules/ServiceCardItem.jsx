import { motion } from "framer-motion";
import { useState, useEffect, startTransition } from "react";
import { authService } from "../../services/authService";
import { favoriteService } from "../../services/favoriteService";
import { bookmarkService } from "../../services/bookmarkService";
import FavoriteToast from "./FavoriteToast";
import SavedToast from "./SavedToast";
import UnfavoriteConfirmModal from "./UnfavoriteConfirmModal";
import UnsaveConfirmModal from "./UnsaveConfirmModal";

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
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(service.id);
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

  // Ensure initial bookmark state reflects server on refresh/navigation
  useEffect(() => {
    let cancelled = false;

    const hydrateBookmarkState = async () => {
      if (!user || !isClient || !service?.id) return;

      // Don't override state if there's a pending optimistic operation
      if (pendingBookmarkOperation) {
        console.log('[ServiceCardItem] Skipping hydration - pending operation');
        return;
      }

      try {
        const res = await bookmarkService.isBookmarked(service.id);
        if (cancelled) return;
        if (res?.success && typeof res.data?.isBookmarked === "boolean") {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (_) {
        // ignore - keep current optimistic state
      }
    };

    hydrateBookmarkState();
    return () => {
      cancelled = true;
    };
  }, [user, isClient, service?.id, pendingBookmarkOperation]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
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

        // Update localStorage immediately (offline-first)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        console.log('[ServiceCardItem] Current favorites before add:', favorites);

        if (!favorites.includes(service.id)) {
          favorites.push(service.id);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log('[ServiceCardItem] Favorites after add:', favorites);

        // Trigger custom event for same tab (StorageEvent only works cross-tab)
        window.dispatchEvent(new CustomEvent('favoritesChanged', {
          detail: { favorites, serviceId: service.id, action: 'add' }
        }));

        // Update UI instantly
        setIsFavorite(true);
        if (onFavoriteToggle) {
          onFavoriteToggle(service.id, true);
        }

        // Show toast notification
        setShowToast(true);

        // Sync to backend in background (don't block UI)
        favoriteService.toggleFavorite(service.id, true).catch((err) => {
          console.log("[ServiceCardItem] Backend favorite sync failed:", err);
          // Keep localStorage state, don't revert
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
        // Update localStorage immediately (offline-first)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const index = favorites.indexOf(service.id);
        if (index > -1) {
          favorites.splice(index, 1);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Trigger custom event for same tab (StorageEvent only works cross-tab)
        window.dispatchEvent(new CustomEvent('favoritesChanged', {
          detail: { favorites, serviceId: service.id, action: 'remove' }
        }));

        // Update UI instantly
        setIsFavorite(false);
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
    console.log('[ServiceCardItem] handleBookmarkClick called', {
      serviceId: service.id,
      user: !!user,
      isClient,
      isBookmarked
    });

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
        onClick={onClick}
        className={`cursor-pointer group ${
          fullWidth ? "w-full" : "flex-shrink-0 w-64"
        }`}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD]">
            <img
              src={thumbnailSrc}
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
          <div className="relative p-4">
            <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors">
              {service.title}
            </h3>

            {/* Freelancer Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]" />
              <span className="text-sm text-neutral-600">
                {service.freelancer}
              </span>
            </div>

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
                  Rp {service.price.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Favorite & Bookmark Icons - Only show for logged in clients */}
            {isClient && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-all"
                  aria-label="Tambah ke favorit"
                >
                  <i
                    className={`${isFavorite ? "fas" : "far"} fa-heart ${
                      isFavorite ? "text-red-500" : "text-neutral-600"
                    } text-lg transition-all duration-200 pointer-events-none`}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-all"
                  aria-label="Simpan layanan"
                >
                  <i
                    className={`${isBookmarked ? "fas" : "far"} fa-bookmark ${
                      isBookmarked ? "text-neutral-900" : "text-neutral-600"
                    } text-lg transition-all duration-200 pointer-events-none`}
                  />
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
