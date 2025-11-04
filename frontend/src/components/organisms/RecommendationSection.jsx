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

function RecommendationCard({ service, onClick, onRemove, onFavoriteToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(service);
        }}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-md"
        aria-label="Hapus dari rekomendasi"
      >
        <i className="fas fa-times text-neutral-600 hover:text-red-500 text-xs" />
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
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState(null);

  const handleRemoveClick = (service) => {
    setServiceToRemove(service);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (serviceToRemove) {
      setRecommendations((prev) => prev.filter((item) => item.id !== serviceToRemove.id));
    }
    setShowRemoveModal(false);
    setServiceToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setServiceToRemove(null);
  };

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <>
      <section className="py-12 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
                Rekomendasi Untuk Anda
              </span>
            </h2>
            <p className="text-neutral-600">
              Layanan yang mungkin Anda sukai berdasarkan aktivitas Anda
            </p>
          </motion.div>

          {/* Recommendations Grid */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((service) => (
                <RecommendationCard
                  key={service.id}
                  service={service}
                  onClick={() => onServiceClick && onServiceClick(service)}
                  onRemove={handleRemoveClick}
                  onFavoriteToggle={onFavoriteToggle}
                />
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* Remove Confirmation Modal */}
      <RemoveRecommendationModal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        serviceName={serviceToRemove?.title}
      />
    </>
  );
}
