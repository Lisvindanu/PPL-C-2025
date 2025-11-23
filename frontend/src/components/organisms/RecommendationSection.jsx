import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCardItem from "../molecules/ServiceCardItem";
import RemoveRecommendationModal from "../molecules/RemoveRecommendationModal";
import { allServices } from "../../utils/servicesData";

// Get random 8 services for recommendations
const getRandomRecommendations = () => {
  const shuffled = [...allServices].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
};

const initialRecommendations = getRandomRecommendations();

function RecommendationCard({ service, onClick, onHide, onFavoriteToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Hide Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHide(service);
        }}
        className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 shadow-md"
        aria-label="Sembunyikan dari rekomendasi"
        title="Sembunyikan rekomendasi ini"
      >
        <i className="fas fa-eye-slash text-neutral-600 text-xs" />
      </button>

      {/* Service Card */}
      <ServiceCardItem
        service={service}
        onClick={onClick}
        onFavoriteToggle={onFavoriteToggle}
        fullWidth={true}
      />
    </motion.div>
  );
}

export default function RecommendationSection({ onServiceClick, onFavoriteToggle }) {
  // Load hidden recommendations from localStorage
  const getHiddenRecommendations = () => {
    try {
      const hidden = JSON.parse(localStorage.getItem('hiddenRecommendations') || '[]');
      return hidden;
    } catch {
      return [];
    }
  };

  // Filter out hidden recommendations
  const getVisibleRecommendations = () => {
    const hidden = getHiddenRecommendations();
    return initialRecommendations.filter(service => !hidden.includes(service.id));
  };

  const [recommendations, setRecommendations] = useState(getVisibleRecommendations());
  const [hiddenCount, setHiddenCount] = useState(getHiddenRecommendations().length);
  const [showHideModal, setShowHideModal] = useState(false);
  const [serviceToHide, setServiceToHide] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleHideClick = (service) => {
    setServiceToHide(service);
    setShowHideModal(true);
  };

  const handleConfirmHide = () => {
    if (serviceToHide) {
      // Remove from visible list
      setRecommendations((prev) => prev.filter((item) => item.id !== serviceToHide.id));

      // Save to localStorage
      const hidden = getHiddenRecommendations();
      if (!hidden.includes(serviceToHide.id)) {
        hidden.push(serviceToHide.id);
        localStorage.setItem('hiddenRecommendations', JSON.stringify(hidden));
        setHiddenCount(hidden.length);
      }
    }
    setShowHideModal(false);
    setServiceToHide(null);
  };

  const handleCancelHide = () => {
    setShowHideModal(false);
    setServiceToHide(null);
  };

  const handleRestoreAll = () => {
    // Clear hidden recommendations from localStorage
    localStorage.removeItem('hiddenRecommendations');

    // Restore all recommendations
    setRecommendations(initialRecommendations);
    setHiddenCount(0);
  };

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Always show section if there are hidden recommendations
  if (recommendations.length === 0 && hiddenCount === 0) {
    return null; // Don't show section if no recommendations at all
  }

  return (
    <>
      <section className="py-12 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Title with Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
                    Rekomendasi Untuk Anda
                  </span>
                </h2>
                <p className="text-neutral-600">
                  Layanan yang mungkin Anda sukai berdasarkan aktivitas Anda
                  {hiddenCount > 0 && (
                    <span className="ml-2 text-sm text-neutral-500">
                      ({hiddenCount} rekomendasi disembunyikan)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hiddenCount > 0 && (
                  <button
                    onClick={handleRestoreAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4782BE] text-white hover:bg-[#1D375B] transition-all shadow-sm"
                    title="Tampilkan semua rekomendasi yang disembunyikan"
                  >
                    <i className="fas fa-redo text-sm" />
                    <span className="text-sm font-medium">
                      Tampilkan Semua
                    </span>
                  </button>
                )}
                <button
                  onClick={toggleExpanded}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm"
                  title={isExpanded ? 'Sembunyikan Section' : 'Tampilkan Section'}
                >
                  <i className={`fas fa-eye${isExpanded ? '-slash' : ''} text-neutral-600`} />
                  <span className="text-sm font-medium text-neutral-700">
                    {isExpanded ? 'Sembunyikan' : 'Tampilkan'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Grid */}
          {isExpanded && (
            <>
              {recommendations.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {recommendations.map((service) => (
                      <RecommendationCard
                        key={service.id}
                        service={service}
                        onClick={() => onServiceClick && onServiceClick(service)}
                        onHide={handleHideClick}
                        onFavoriteToggle={onFavoriteToggle}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <i className="fas fa-eye-slash text-6xl text-neutral-300 mb-4"></i>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Semua Rekomendasi Disembunyikan
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Anda telah menyembunyikan {hiddenCount} rekomendasi
                  </p>
                  <button
                    onClick={handleRestoreAll}
                    className="bg-[#4782BE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D375B] transition-colors"
                  >
                    <i className="fas fa-redo mr-2" />
                    Tampilkan Semua Kembali
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Hide Confirmation Modal */}
      <RemoveRecommendationModal
        isOpen={showHideModal}
        onClose={handleCancelHide}
        onConfirm={handleConfirmHide}
        serviceName={serviceToHide?.title}
      />
    </>
  );
}
