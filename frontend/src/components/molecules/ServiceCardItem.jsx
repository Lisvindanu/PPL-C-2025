import { motion } from "framer-motion";
import { useState } from "react";
import { authService } from "../../services/authService";
import { favoriteService } from "../../services/favoriteService";
import FavoriteToast from "./FavoriteToast";
import SavedToast from "./SavedToast";
import UnfavoriteConfirmModal from "./UnfavoriteConfirmModal";
import UnsaveConfirmModal from "./UnsaveConfirmModal";

export default function ServiceCardItem({ service, onClick, onFavoriteToggle, onSaveToggle, fullWidth = false }) {
  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  // Load initial favorite status from localStorage
  const getFavoriteStatus = () => {
    if (!user) return false;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(service.id);
  };

  // Load initial saved status from localStorage
  const getSavedStatus = () => {
    if (!user) return false;
    const saved = JSON.parse(localStorage.getItem('saved') || '[]');
    return saved.includes(service.id);
  };

  const [isFavorite, setIsFavorite] = useState(getFavoriteStatus());
  const [isSaved, setIsSaved] = useState(getSavedStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showUnfavoriteModal, setShowUnfavoriteModal] = useState(false);
  const [showUnsaveModal, setShowUnsaveModal] = useState(false);

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

  const handleSaveClick = async (e) => {
    e.stopPropagation();

    if (!user || !isClient) {
      return; // Silent fail - better UX
    }

    // If unsaving, show confirmation modal
    if (isSaved) {
      setShowUnsaveModal(true);
      return;
    }

    // Saving (no confirmation needed)
    setIsSaveLoading(true);

    try {
      // Update localStorage immediately (offline-first)
      const saved = JSON.parse(localStorage.getItem('saved') || '[]');
      if (!saved.includes(service.id)) {
        saved.push(service.id);
      }
      localStorage.setItem('saved', JSON.stringify(saved));

      // Update UI
      setIsSaved(true);
      if (onSaveToggle) {
        onSaveToggle(service.id, true);
      }

      // Show toast notification
      setShowSaveToast(true);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleConfirmUnsave = async () => {
    setShowUnsaveModal(false);
    setIsSaveLoading(true);

    try {
      // Update localStorage immediately (offline-first)
      const saved = JSON.parse(localStorage.getItem('saved') || '[]');
      const index = saved.indexOf(service.id);
      if (index > -1) {
        saved.splice(index, 1);
      }
      localStorage.setItem('saved', JSON.stringify(saved));

      // Update UI
      setIsSaved(false);
      if (onSaveToggle) {
        onSaveToggle(service.id, false);
      }

      // Show toast notification
      setShowSaveToast(true);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={`cursor-pointer group ${fullWidth ? 'w-full' : 'flex-shrink-0 w-64'}`}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
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
        <div className="relative p-4">
          <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors">
            {service.title}
          </h3>

          {/* Freelancer Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]" />
            <span className="text-sm text-neutral-600">{service.freelancer}</span>
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
                Rp {service.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Favorite & Bookmark Icons - Only show for logged in clients */}
          {isClient && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin text-neutral-600 text-lg" />
                ) : (
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart ${isFavorite ? 'text-red-500' : 'text-neutral-600'} text-lg`} />
                )}
              </button>

              <button
                onClick={handleSaveClick}
                disabled={isSaveLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaveLoading ? (
                  <i className="fas fa-spinner fa-spin text-neutral-600 text-lg" />
                ) : (
                  <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark ${isSaved ? 'text-neutral-900' : 'text-neutral-600'} text-lg`} />
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
        isOpen={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        isSaved={isSaved}
      />

      {/* Unfavorite Confirmation Modal */}
      <UnfavoriteConfirmModal
        isOpen={showUnfavoriteModal}
        onClose={() => setShowUnfavoriteModal(false)}
        onConfirm={handleConfirmUnfavorite}
        serviceName={service.title}
      />

      {/* Unsave Confirmation Modal */}
      <UnsaveConfirmModal
        isOpen={showUnsaveModal}
        onClose={() => setShowUnsaveModal(false)}
        onConfirm={handleConfirmUnsave}
        serviceName={service.title}
      />
    </>
  );
}
