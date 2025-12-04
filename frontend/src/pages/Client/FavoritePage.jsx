import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { getServiceById } from "../../utils/servicesData";
import Navbar from "../../components/Fragments/Common/Navbar";
import Footer from "../../components/Fragments/Common/Footer";
import ServiceCardItem from "../../components/Fragments/Service/ServiceCardItem";

export default function FavoritePage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = () => {
    try {
      // Load from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

      // Get full service data
      const favoriteServices = favoriteIds
        .map(id => getServiceById(id))
        .filter(Boolean)
        .map(service => ({ ...service, isFavorite: true }));

      setFavorites(favoriteServices);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (serviceId, isFavorite) => {
    // Remove from list if unfavorited
    if (!isFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== serviceId));
    }
  };

  const handleServiceClick = (service) => {
    navigate(`/layanan/${service.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-[#4782BE] mb-4"></i>
            <p className="text-neutral-600">Memuat favorit Anda...</p>
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Favorit Anda</h1>
          <p className="text-neutral-600">Layanan yang telah Anda simpan sebagai favorit</p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <i className="far fa-heart text-6xl text-neutral-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Belum Ada Favorit
            </h2>
            <p className="text-neutral-600 mb-6">
              Anda belum menambahkan layanan apapun ke favorit
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4782BE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D375B] transition-colors"
            >
              Jelajahi Layanan
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-neutral-600">
              {favorites.length} layanan favorit
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((service) => (
                <ServiceCardItem
                  key={service.id}
                  service={service}
                  onClick={() => handleServiceClick(service)}
                  onFavoriteToggle={handleFavoriteToggle}
                  fullWidth={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
