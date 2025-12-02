import { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCardItem from "../molecules/ServiceCardItem";
import RemoveRecommendationModal from "../molecules/RemoveRecommendationModal";
import { serviceService } from "../../services/serviceService";
import { favoriteService } from "../../services/favoriteService";

const RecommendationCard = forwardRef(({ service, onClick, onHide, onFavoriteToggle }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Hide Button - positioned at top-right corner INSIDE the card */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onHide(service);
        }}
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-neutral-900/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-500 transition-all duration-200 shadow-lg"
        aria-label="Sembunyikan dari rekomendasi"
        title="Sembunyikan rekomendasi ini"
      >
        <i className="fas fa-times text-xs pointer-events-none" />
      </button>

      {/* Service Card - exactly same as popular services */}
      <ServiceCardItem
        service={service}
        onClick={onClick}
        onFavoriteToggle={onFavoriteToggle}
        fullWidth={false}
      />
    </motion.div>
  );
});

RecommendationCard.displayName = 'RecommendationCard';

export default function RecommendationSection({ onServiceClick, onFavoriteToggle }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [allRecommendations, setAllRecommendations] = useState([]); // Store all recommendations
  const [loading, setLoading] = useState(true);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [showHideModal, setShowHideModal] = useState(false);
  const [serviceToHide, setServiceToHide] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollContainerRef = useRef(null);

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

        // Try to get cached recommendations first (v10 - force fresh data)
        // Note: versionChecker.js handles global cache cleanup
        const cachedKey = 'cachedRecommendations_v10';
        const cached = sessionStorage.getItem(cachedKey);

        // Known invalid service IDs that should trigger cache invalidation
        const INVALID_IDS = ['2be326c4-d1b4-4493-902f-52e18a116d3a'];

        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);

            // Validate cache: check for known invalid IDs
            const hasInvalidIds = parsedCache.some(service =>
              INVALID_IDS.includes(service.id)
            );

            if (hasInvalidIds) {
              console.warn('[RecommendationSection] Cache contains invalid IDs, clearing and fetching fresh data');
              sessionStorage.removeItem(cachedKey);
              // Continue to fetch below
            } else {
              console.log('[RecommendationSection] Using cached recommendations:', parsedCache.length, 'cards');

              // Store all recommendations
              setAllRecommendations(parsedCache);

              const visible = parsedCache.filter(s => !hidden.includes(s.id));
              setRecommendations(visible);
              setLoading(false);
              return;
            }
          } catch {
            // Invalid cache, continue to fetch
            console.log('[RecommendationSection] Invalid cache, fetching fresh data');
            sessionStorage.removeItem(cachedKey);
          }
        }

        console.log('[RecommendationSection] No cache found, fetching from backend...');

        // Fetch active services from backend
        const result = await serviceService.getAllServices({
          page: 1,
          limit: 20,
          status: 'aktif'
        });

        if (cancelled) return;

        if (result.success && result.services && result.services.length > 0) {
          // Map services
          const mappedServices = result.services.map(service => ({
            id: service.id,
            slug: service.slug,
            title: service.judul || service.nama_layanan || service.title,
            category: service.nama_kategori || service.kategori_nama || service.category || 'Lainnya',
            freelancer: service.freelancer?.nama_lengkap || service.freelancer_name || service.freelancer || 'Freelancer',
            rating: parseFloat(service.rating_rata_rata || service.rating || 0),
            reviews: parseInt(service.jumlah_rating || service.jumlah_ulasan || service.reviews || 0),
            price: parseFloat(service.harga || service.price || 0),
            thumbnail: service.thumbnail,
          }));

          // Use backend services only (no mock data fallback)
          // Shuffle once and take up to 10 services (or less if not enough services)
          const shuffled = [...mappedServices].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, Math.min(10, mappedServices.length));
          console.log('[RecommendationSection] Using', selected.length, 'services from backend (no mock data)');
          console.log('[RecommendationSection] Service IDs:', selected.map(s => s.id).join(', '));

          // Fetch favorite counts for all selected services
          const serviceIds = selected.map(s => s.id);
          const countsResult = await favoriteService.getFavoriteCounts(serviceIds);
          const favoriteCounts = countsResult.success ? countsResult.data : {};
          console.log('[RecommendationSection] Favorite counts:', favoriteCounts);

          // Add favorite counts to services
          const servicesWithCounts = selected.map(service => ({
            ...service,
            favoriteCount: favoriteCounts[service.id] || 0
          }));
          console.log('[RecommendationSection] Services with favorite counts:', servicesWithCounts);

          // Sort by favorite count (highest first) - show most loved services first
          const sortedServices = [...servicesWithCounts].sort((a, b) => b.favoriteCount - a.favoriteCount);
          console.log('[RecommendationSection] Sorted by favorite count:', sortedServices.map(s => `${s.title}: ${s.favoriteCount}`));

          // Cache the recommendations for this session (with favorite counts, sorted)
          sessionStorage.setItem(cachedKey, JSON.stringify(sortedServices));

          // Store all recommendations
          setAllRecommendations(sortedServices);

          // Filter out hidden ones
          const visible = sortedServices.filter(s => !hidden.includes(s.id));
          setRecommendations(visible);
        } else {
          // No services from backend - show empty
          console.log('[RecommendationSection] No services from backend');
          setRecommendations([]);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('[RecommendationSection] Error fetching recommendations:', error);
        // Show empty on error
        setRecommendations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('[RecommendationSection] Fetching categories...');
        const result = await serviceService.getCategories();
        console.log('[RecommendationSection] Categories result:', result);
        if (result.success && result.categories) {
          console.log('[RecommendationSection] Categories loaded:', result.categories.length, 'categories');
          console.log('[RecommendationSection] Category list:', result.categories.map(c => c.nama).join(', '));
          setCategories(result.categories);
        } else {
          console.warn('[RecommendationSection] Failed to load categories:', result);
        }
      } catch (error) {
        console.error('[RecommendationSection] Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Filter recommendations by category
  useEffect(() => {
    const hidden = getHiddenRecommendations();

    if (selectedCategory === 'all') {
      // Show all recommendations (minus hidden)
      const visible = allRecommendations.filter(s => !hidden.includes(s.id));
      setRecommendations(visible);
    } else {
      // Filter by category and hidden
      const filtered = allRecommendations.filter(s =>
        s.category === selectedCategory && !hidden.includes(s.id)
      );
      setRecommendations(filtered);
    }
  }, [selectedCategory, allRecommendations]);

  // Listen to changes from HiddenRecommendationsPage
  useEffect(() => {
    const handleHiddenChanged = () => {
      console.log('[RecommendationSection] Hidden recommendations changed, updating count');
      const hidden = getHiddenRecommendations();
      setHiddenCount(hidden.length);

      // Also update visible recommendations with category filter
      const cachedKey = 'cachedRecommendations_v10';
      const cached = sessionStorage.getItem(cachedKey);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          setAllRecommendations(parsedCache);

          // Apply category filter
          let filtered = parsedCache;
          if (selectedCategory !== 'all') {
            filtered = parsedCache.filter(s => s.category === selectedCategory);
          }

          const visible = filtered.filter(s => !hidden.includes(s.id));
          setRecommendations(visible);
        } catch (error) {
          console.error('[RecommendationSection] Error updating after hidden change:', error);
        }
      }
    };

    window.addEventListener('hiddenRecommendationsChanged', handleHiddenChanged);
    return () => {
      window.removeEventListener('hiddenRecommendationsChanged', handleHiddenChanged);
    };
  }, [selectedCategory]);

  // Listen to favorite toggle events to invalidate cache
  useEffect(() => {
    const handleFavoriteChanged = (event) => {
      console.log('[RecommendationSection] Favorite changed, invalidating cache');
      // Clear the cache so next mount will fetch fresh data with updated counts
      const cachedKey = 'cachedRecommendations_v10';
      sessionStorage.removeItem(cachedKey);
    };

    window.addEventListener('favoriteChanged', handleFavoriteChanged);
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChanged);
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

    // Get cached recommendations
    try {
      const cachedKey = 'cachedRecommendations_v10';
      const cached = sessionStorage.getItem(cachedKey);

      if (cached) {
        const parsedCache = JSON.parse(cached);
        setAllRecommendations(parsedCache);

        // Apply category filter
        if (selectedCategory === 'all') {
          setRecommendations(parsedCache);
        } else {
          const filtered = parsedCache.filter(s => s.category === selectedCategory);
          setRecommendations(filtered);
        }
      } else {
        // Re-fetch if no cache
        const result = await serviceService.getAllServices({
          page: 1,
          limit: 20,
          status: 'aktif'
        });

        if (result.success && result.services && result.services.length > 0) {
          const mappedServices = result.services.map(service => ({
            id: service.id,
            slug: service.slug,
            title: service.judul || service.nama_layanan || service.title,
            category: service.nama_kategori || service.kategori_nama || service.category || 'Lainnya',
            freelancer: service.freelancer?.nama_lengkap || service.freelancer_name || service.freelancer || 'Freelancer',
            rating: parseFloat(service.rating_rata_rata || service.rating || 0),
            reviews: parseInt(service.jumlah_rating || service.jumlah_ulasan || service.reviews || 0),
            price: parseFloat(service.harga || service.price || 0),
            thumbnail: service.thumbnail,
          }));

          const shuffled = [...mappedServices].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, Math.min(10, mappedServices.length));

          // Fetch favorite counts
          const serviceIds = selected.map(s => s.id);
          const countsResult = await favoriteService.getFavoriteCounts(serviceIds);
          const favoriteCounts = countsResult.success ? countsResult.data : {};

          const servicesWithCounts = selected.map(service => ({
            ...service,
            favoriteCount: favoriteCounts[service.id] || 0
          }));

          // Sort by favorite count
          const sortedServices = [...servicesWithCounts].sort((a, b) => b.favoriteCount - a.favoriteCount);

          sessionStorage.setItem(cachedKey, JSON.stringify(sortedServices));
          setAllRecommendations(sortedServices);

          // Apply category filter
          if (selectedCategory === 'all') {
            setRecommendations(sortedServices);
          } else {
            const filtered = sortedServices.filter(s => s.category === selectedCategory);
            setRecommendations(filtered);
          }
        }
      }
    } catch (error) {
      console.error('[RecommendationSection] Error restoring:', error);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
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
                    <span className="ml-2 text-sm">
                      <span className="text-neutral-500">
                        ({hiddenCount} rekomendasi disembunyikan)
                      </span>
                      {" · "}
                      <button
                        onClick={() => navigate('/hide-rekomendasi')}
                        className="text-[#4782BE] hover:text-[#1D375B] hover:underline font-medium"
                      >
                        Lihat Semua
                      </button>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Category Filter Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm text-sm font-medium text-neutral-700 cursor-pointer appearance-none pr-10"
                    title="Filter berdasarkan kategori"
                    style={{
                      backgroundImage: 'none'
                    }}
                  >
                    <option value="all" className="bg-white text-neutral-700 py-2">Semua Kategori</option>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.nama}
                          className="bg-white text-neutral-700 py-2"
                        >
                          {category.nama}
                        </option>
                      ))
                    ) : (
                      <option disabled className="bg-white text-neutral-400 py-2">Memuat kategori...</option>
                    )}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs pointer-events-none" />
                </div>

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
              </div>
            </div>
          </motion.div>

          {/* Recommendations Carousel */}
          <>
            {recommendations.length > 0 ? (
                <div className="flex items-center gap-4">
                  {/* Scroll Left Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      scroll("left");
                    }}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] flex items-center justify-center hover:from-[#4782BE] hover:to-[#1D375B] transition-all duration-300 shadow-md hover:shadow-xl group"
                  >
                    <i className="fas fa-chevron-left text-lg text-[#1D375B] group-hover:text-white transition-colors" />
                  </button>

                  {/* Services Cards Carousel */}
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide flex-1"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <AnimatePresence mode="popLayout">
                      {recommendations.map((service) => (
                        <RecommendationCard
                          key={service.id}
                          service={service}
                          onClick={() => onServiceClick && onServiceClick(service)}
                          onHide={handleHideClick}
                          onFavoriteToggle={onFavoriteToggle}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Scroll Right Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      scroll("right");
                    }}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B] flex items-center justify-center hover:shadow-xl transition-all duration-300 shadow-md"
                  >
                    <i className="fas fa-chevron-right text-lg text-white" />
                  </button>
                </div>
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
