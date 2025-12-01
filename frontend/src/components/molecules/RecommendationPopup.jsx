import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getRecommendedServices, getPersonalizedGreeting } from "../../utils/recommendationEngine";
import { serviceService } from "../../services/serviceService";

export default function RecommendationPopup({ isOpen, onClose, currentService }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const loadRecommendations = async () => {
      try {
        setLoading(true);

        // Fetch all services
        const result = await serviceService.getAllServices({
          limit: 50,
          status: 'aktif'
        });

        if (result.success && result.services) {
          const mappedServices = result.services.map(service => ({
            id: service.id,
            slug: service.slug,
            title: service.judul || service.nama_layanan || service.title,
            category: service.nama_kategori || service.category || 'Lainnya',
            kategori_id: service.kategori_id,
            freelancer: service.freelancer?.nama_lengkap || service.freelancer_name || 'Freelancer',
            rating: parseFloat(service.rating_rata_rata || service.rating || 0),
            reviews: parseInt(service.jumlah_rating || service.reviews || 0),
            price: parseFloat(service.harga || service.price || 0),
            thumbnail: service.thumbnail
          }));

          // Get recommendations (4 items for popup)
          const recommended = getRecommendedServices(mappedServices, {
            limit: 4,
            excludeFavorited: true,
            minRating: 4.0,
            sortBy: 'rating'
          });

          setRecommendations(recommended);
        }
      } catch (error) {
        console.error('[RecommendationPopup] Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Popup Content */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                {loading ? 'Memuat...' : getPersonalizedGreeting([])}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Berdasarkan favorit Anda
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
              aria-label="Tutup"
            >
              <i className="fas fa-times text-neutral-600 text-lg"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <i className="fas fa-spinner fa-spin text-3xl text-[#4782BE]"></i>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-box-open text-5xl text-neutral-300 mb-4"></i>
                <p className="text-neutral-600">Belum ada rekomendasi tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => {
                      window.location.href = `/layanan/${service.id}`;
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-32 bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] overflow-hidden">
                      <img
                        src={service.thumbnail || "/asset/layanan/Layanan.png"}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1D375B]">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors">
                        {service.title}
                      </h4>

                      {/* Rating & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <i className="fas fa-star text-yellow-400 text-xs" />
                          <span className="text-xs font-semibold text-neutral-900">
                            {service.rating}
                          </span>
                          <span className="text-xs text-neutral-500">
                            ({service.reviews})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#4782BE]">
                            Rp {service.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-neutral-50 border-t px-6 py-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#4782BE] text-white rounded-xl font-semibold hover:bg-[#1D375B] transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
