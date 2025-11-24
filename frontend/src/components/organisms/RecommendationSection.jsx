import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCardItem from "../molecules/ServiceCardItem";
import RemoveRecommendationModal from "../molecules/RemoveRecommendationModal";
import { allServices } from "../../utils/servicesData";
import { serviceService } from "../../services/serviceService";

// Get random 8 services for recommendations (MOCK FALLBACK)
const getRandomRecommendations = () => {
  const shuffled = [...allServices].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
};

function RecommendationCard({ service, onClick, onHide, onFavoriteToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative h-full"
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
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [showHideModal, setShowHideModal] = useState(false);
  const [serviceToHide, setServiceToHide] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load hidden recommendations from localStorage
  const getHiddenRecommendations = () => {
    try {
      const hidden = JSON.parse(localStorage.getItem('hiddenRecommendations') || '[]');
      return hidden;
    } catch {
      return [];
    }
  };

  // Fetch recommendations from backend
  useEffect(() => {
    let cancelled = false;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const hidden = getHiddenRecommendations();
        setHiddenCount(hidden.length);

        // Fetch active services from backend
        const result = await serviceService.getAllServices({
          page: 1,
          limit: 20,
          status: 'aktif'
        });

        if (cancelled) return;

        if (result.success && result.services && result.services.length > 0) {
          // Map and shuffle services
          const mappedServices = result.services.map(service => ({
            id: service.id,
            title: service.judul || service.title,
            category: service.nama_kategori || service.category || 'Lainnya',
            freelancer: service.freelancer?.nama_lengkap || service.freelancer || 'Freelancer',
            rating: parseFloat(service.rating_rata_rata || service.rating || 0),
            reviews: parseInt(service.jumlah_rating || service.reviews || 0),
            price: parseFloat(service.harga || service.price || 0),
            slug: service.slug
          }));

          // Shuffle and take services (always show 4 or 8 for clean grid layout)
          const shuffled = [...mappedServices].sort(() => 0.5 - Math.random());
          const count = mappedServices.length >= 8 ? 8 : 4;
          const selected = shuffled.slice(0, Math.min(count, mappedServices.length));

          // Filter out hidden ones
          const visible = selected.filter(s => !hidden.includes(s.id));
          setRecommendations(visible);
        } else {
          // Fallback to mock data
          console.log('[RecommendationSection] No services from backend, using mock data');
          const mockRecs = getRandomRecommendations();
          const visible = mockRecs.filter(s => !hidden.includes(s.id));
          setRecommendations(visible);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('[RecommendationSection] Error fetching recommendations:', error);
        // Fallback to mock data
        const mockRecs = getRandomRecommendations();
        const hidden = getHiddenRecommendations();
        const visible = mockRecs.filter(s => !hidden.includes(s.id));
        setRecommendations(visible);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleRestoreAll = async () => {
    // Clear hidden recommendations from localStorage
    localStorage.removeItem('hiddenRecommendations');
    setHiddenCount(0);

    // Re-fetch recommendations
    try {
      const result = await serviceService.getAllServices({
        page: 1,
        limit: 20,
        status: 'aktif'
      });

      if (result.success && result.services && result.services.length > 0) {
        const mappedServices = result.services.map(service => ({
          id: service.id,
          title: service.judul || service.title,
          category: service.nama_kategori || service.category || 'Lainnya',
          freelancer: service.freelancer?.nama_lengkap || service.freelancer || 'Freelancer',
          rating: parseFloat(service.rating_rata_rata || service.rating || 0),
          reviews: parseInt(service.jumlah_rating || service.reviews || 0),
          price: parseFloat(service.harga || service.price || 0),
          slug: service.slug
        }));
        const shuffled = [...mappedServices].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 8));
      }
    } catch (error) {
      console.error('[RecommendationSection] Error restoring:', error);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-12 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-[#4782BE]"></i>
        </div>
      </section>
    );
  }

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
                    className={`grid gap-6 items-stretch ${
                      recommendations.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                      recommendations.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
                      recommendations.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                      recommendations.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
                      recommendations.length === 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                      recommendations.length === 7 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7' :
                      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}
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
