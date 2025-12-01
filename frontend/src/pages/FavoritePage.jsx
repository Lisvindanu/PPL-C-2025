import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { serviceService } from "../services/serviceService";
import { getFavoriteIds, clearAllFavorites } from "../utils/favoriteStorage";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import ServiceCardItem from "../components/molecules/ServiceCardItem";

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

    // ONE-TIME CLEANUP: Clear old favorites with invalid IDs
    // TODO: Remove this after first deployment
    const hasCleanedUp = localStorage.getItem('favorites_cleaned_v1');
    if (!hasCleanedUp) {
      console.log('[FavoritePage] Running one-time cleanup of old favorites');
      clearAllFavorites();
      localStorage.setItem('favorites_cleaned_v1', 'true');
    }

    loadFavorites();

    // Reload favorites when window gains focus (user switches back to tab)
    const handleFocus = () => {
      console.log('[FavoritePage] Window focused, reloading favorites');
      loadFavorites();
    };
    window.addEventListener('focus', handleFocus);

    // Reload favorites when localStorage changes (from other tabs)
    const handleStorage = (e) => {
      if (e.key === 'favorites_v2' || e.key === 'favorites') {
        console.log('[FavoritePage] Storage event detected, reloading favorites');
        loadFavorites();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Listen to custom event for same-tab changes
    const handleFavoritesChanged = (e) => {
      console.log('[FavoritePage] favoritesChanged event detected', e.detail);
      loadFavorites();
    };
    window.addEventListener('favoritesChanged', handleFavoritesChanged);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('favoritesChanged', handleFavoritesChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // Load from favoriteStorage utility (handles migration automatically)
      const favoriteIds = getFavoriteIds();

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      console.log('[FavoritePage] Loading favorites for IDs:', favoriteIds);

      // Load services from backend ONLY (no mock data)
      const favoriteServices = [];

      for (const id of favoriteIds) {
        try {
          const result = await serviceService.getServiceById(id);
          if (result.success && result.service) {
            // Map backend service to frontend format
            const service = {
              id: result.service.id,
              title: result.service.judul || result.service.title,
              category: result.service.nama_kategori || result.service.category || 'Lainnya',
              freelancer: result.service.freelancer?.nama_lengkap || result.service.freelancer || 'Freelancer',
              rating: parseFloat(result.service.rating_rata_rata || result.service.rating || 0),
              reviews: parseInt(result.service.jumlah_rating || result.service.reviews || 0),
              price: parseFloat(result.service.harga || result.service.price || 0),
              slug: result.service.slug,
              thumbnail: result.service.thumbnail
            };
            favoriteServices.push({ ...service, isFavorite: true });
          } else {
            console.warn('[FavoritePage] Service not found in backend:', id);
          }
        } catch (error) {
          console.error('[FavoritePage] Error fetching service from backend:', id, error);
        }
      }

      console.log('[FavoritePage] Loaded favorites:', favoriteServices);
      setFavorites(favoriteServices);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (serviceId, isFavorite) => {
    console.log('[FavoritePage] handleFavoriteToggle called', { serviceId, isFavorite });
    // Remove from list if unfavorited
    if (!isFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== serviceId));
    } else {
      // If favorited, reload the list
      console.log('[FavoritePage] Item favorited, reloading list');
      loadFavorites();
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
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
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
