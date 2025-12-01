import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { serviceService } from "../services/serviceService";
import { favoriteService } from "../services/favoriteService";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import ServiceCardItem from "../components/molecules/ServiceCardItem";
import RestoreRecommendationModal from "../components/molecules/RestoreRecommendationModal";
import RestoreAllRecommendationsModal from "../components/molecules/RestoreAllRecommendationsModal";

export default function HiddenRecommendationsPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [serviceToRestore, setServiceToRestore] = useState(null);
  const [showRestoreAllModal, setShowRestoreAllModal] = useState(false);

  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!isClient) {
      navigate("/");
      return;
    }
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get hidden service IDs from localStorage
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenRecommendations') || '[]');

      if (hiddenIds.length === 0) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      console.log('[HiddenRecommendationsPage] Loading hidden services:', hiddenIds);

      // Fetch all services first
      const result = await serviceService.getAllServices({
        page: 1,
        limit: 100,
        status: 'aktif'
      });

      if (result.success && result.services) {
        // Filter only services that are in hiddenIds
        const hiddenServices = result.services.filter(service =>
          hiddenIds.includes(service.id)
        );

        const mappedServices = hiddenServices.map(service => ({
          id: service.id,
          title: service.judul || service.title,
          category: service.nama_kategori || service.category || 'Lainnya',
          freelancer: service.freelancer?.nama_lengkap || service.freelancer || 'Freelancer',
          rating: parseFloat(service.rating_rata_rata || service.rating || 0),
          reviews: parseInt(service.jumlah_rating || service.reviews || 0),
          price: parseInt(service.harga || service.price || 0),
          slug: service.slug,
          thumbnail: service.thumbnail
        }));

        // Fetch favorite counts for hidden services
        const serviceIds = mappedServices.map(s => s.id);
        const countsResult = await favoriteService.getFavoriteCounts(serviceIds);
        const favoriteCounts = countsResult.success ? countsResult.data : {};
        console.log('[HiddenRecommendationsPage] Favorite counts:', favoriteCounts);

        // Add favorite counts to services
        const servicesWithCounts = mappedServices.map(service => ({
          ...service,
          favoriteCount: favoriteCounts[service.id] || 0
        }));
        console.log('[HiddenRecommendationsPage] Hidden services with favorite counts:', servicesWithCounts);

        setRecommendations(servicesWithCounts);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Error loading hidden recommendations:", err);
      setError("Gagal memuat rekomendasi tersembunyi");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    navigate(`/layanan/${service.id}`);
  };

  const handleFavoriteToggle = (serviceId, isFavorite) => {
    console.log('[HiddenRecommendationsPage] Favorite toggled', { serviceId, isFavorite });
    // Update the service in the list
    setRecommendations(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, isFavorite }
          : service
      )
    );
  };

  const handleRestoreClick = (service) => {
    setServiceToRestore(service);
    setShowRestoreModal(true);
  };

  const handleConfirmRestore = () => {
    if (serviceToRestore) {
      console.log('[HiddenRecommendationsPage] Restoring recommendation:', serviceToRestore.id);

      // Remove from hidden list in localStorage
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenRecommendations') || '[]');
      const updatedHiddenIds = hiddenIds.filter(id => id !== serviceToRestore.id);
      localStorage.setItem('hiddenRecommendations', JSON.stringify(updatedHiddenIds));

      // Remove from current list
      setRecommendations(prev => prev.filter(service => service.id !== serviceToRestore.id));

      // Trigger event to update RecommendationSection
      window.dispatchEvent(new Event('hiddenRecommendationsChanged'));
    }
    setShowRestoreModal(false);
    setServiceToRestore(null);
  };

  const handleCancelRestore = () => {
    setShowRestoreModal(false);
    setServiceToRestore(null);
  };

  const handleRestoreAllClick = () => {
    setShowRestoreAllModal(true);
  };

  const handleConfirmRestoreAll = () => {
    console.log('[HiddenRecommendationsPage] Restoring all recommendations');

    // Clear hidden list in localStorage
    localStorage.removeItem('hiddenRecommendations');

    // Clear current list
    setRecommendations([]);

    // Trigger event to update RecommendationSection
    window.dispatchEvent(new Event('hiddenRecommendationsChanged'));

    setShowRestoreAllModal(false);
  };

  const handleCancelRestoreAll = () => {
    setShowRestoreAllModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-[#4782BE] mb-4"></i>
            <p className="text-neutral-600">Memuat rekomendasi untuk Anda...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Rekomendasi yang Disembunyikan
              </h1>
              <p className="text-neutral-600">
                Kelola rekomendasi yang telah Anda sembunyikan
              </p>
            </div>
            {recommendations.length > 0 && (
              <button
                onClick={handleRestoreAllClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4782BE] text-white hover:bg-[#1D375B] transition-colors shadow-sm"
              >
                <i className="fas fa-redo text-sm" />
                <span className="font-medium">Tampilkan Semua Kembali</span>
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && recommendations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <i className="fas fa-eye text-6xl text-neutral-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Tidak Ada Rekomendasi Tersembunyi
            </h2>
            <p className="text-neutral-600 mb-6">
              Anda belum menyembunyikan rekomendasi apapun
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4782BE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D375B] transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* Recommendations Grid */}
        {!error && recommendations.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-neutral-600">
              {recommendations.length} layanan tersembunyi
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((service) => (
                <div key={service.id} className="relative">
                  <ServiceCardItem
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    onFavoriteToggle={handleFavoriteToggle}
                    fullWidth={true}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreClick(service);
                    }}
                    className="absolute top-2 right-2 z-10 bg-[#4782BE] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1D375B] transition-colors shadow-lg flex items-center gap-2"
                    title="Tampilkan kembali rekomendasi ini"
                  >
                    <i className="fas fa-eye text-xs" />
                    <span>Tampilkan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Restore Confirmation Modal */}
      <RestoreRecommendationModal
        isOpen={showRestoreModal}
        onClose={handleCancelRestore}
        onConfirm={handleConfirmRestore}
        serviceName={serviceToRestore?.title}
      />

      {/* Restore All Confirmation Modal */}
      <RestoreAllRecommendationsModal
        isOpen={showRestoreAllModal}
        onClose={handleCancelRestoreAll}
        onConfirm={handleConfirmRestoreAll}
        count={recommendations.length}
      />
    </div>
  );
}
