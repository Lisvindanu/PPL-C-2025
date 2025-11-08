import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { favoriteService } from "../services/favoriteService";
import { getServiceByIdUniversal } from "../utils/servicesData";
import { categoriesWithServices } from "../utils/categoriesWithServices";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import OrderConfirmModal from "../components/molecules/OrderConfirmModal";
import SuccessModal from "../components/molecules/SuccessModal";
import FavoriteToast from "../components/molecules/FavoriteToast";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  useEffect(() => {
    // Load service from either servicesData.js (UUID) or categoriesWithServices (numeric ID)
    const serviceData = getServiceByIdUniversal(id, categoriesWithServices);
    if (serviceData) {
      setService(serviceData);
    } else {
      // If service not found, redirect to services page
      navigate("/services");
    }

    // Check favorite status from localStorage
    if (user && isClient) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      // Convert id to string for comparison
      const idStr = String(id);
      setIsFavorite(favorites.includes(idStr) || favorites.includes(parseInt(id)));
    }
  }, [id, navigate, user, isClient]);

  const handleFavoriteToggle = async () => {
    if (!user || !isClient) return;

    setFavoriteLoading(true);
    const newStatus = !isFavorite;

    try {
      // Update localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      // Convert id to string for consistent comparison
      const idStr = String(id);
      const idNum = parseInt(id);
      
      if (newStatus) {
        // Add if not already in favorites (check both string and number)
        if (!favorites.includes(idStr) && !favorites.includes(idNum) && !favorites.includes(id)) {
          favorites.push(idStr);
        }
      } else {
        // Remove from favorites (check all possible formats)
        const indexStr = favorites.indexOf(idStr);
        const indexNum = favorites.indexOf(idNum);
        const indexId = favorites.indexOf(id);
        
        if (indexStr > -1) {
          favorites.splice(indexStr, 1);
        } else if (indexNum > -1) {
          favorites.splice(indexNum, 1);
        } else if (indexId > -1) {
          favorites.splice(indexId, 1);
        }
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));

      setIsFavorite(newStatus);
      setShowToast(true);

      // Sync to backend (optional)
      favoriteService.toggleFavorite(idStr, newStatus).catch(err => {
        console.log("Backend sync failed:", err);
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isClient) {
      return;
    }

    const newOrderData = {
      id: Date.now(),
      serviceName: service.title,
      freelancerName: service.freelancer,
      freelancerTitle: "Freelancer Profesional",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      category: service.category,
      price: service.price,
      serviceImage: "/asset/layanan/Layanan.png",
      rated: false,
      rating: null,
      package: "Standard",
    };

    setOrderData(newOrderData);
    setIsOrderModalOpen(true);
  };

  const handleConfirmOrder = () => {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    setIsOrderModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    navigate("/riwayat-pesanan");
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#4782BE]"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/services")}
          className="text-[#4782BE] hover:text-[#1D375B] mb-6 flex items-center gap-2 font-medium"
        >
          <i className="fas fa-arrow-left"></i>
          Kembali ke daftar layanan
        </button>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="px-4 py-1 bg-white rounded-full text-sm font-semibold text-[#1D375B] border border-neutral-200">
            {service.category}
          </span>
        </div>

        {/* Service Title */}
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          {service.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image with Freelancer Info */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-6">
              {/* Image Area */}
              <div className="relative h-80 bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] flex items-center justify-center">
                <img
                  src="/asset/layanan/Layanan.png"
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tentang Freelancer */}
              <div className="bg-[#4782BE] p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Tentang Freelancer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white"></div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{service.freelancer}</h4>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-star text-yellow-400 text-sm"></i>
                      <span className="text-white font-semibold">{service.rating} ({service.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setActiveTab("deskripsi")}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "deskripsi"
                      ? "bg-[#4782BE] text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Deskripsi
                </button>
                <button
                  onClick={() => setActiveTab("fitur")}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "fitur"
                      ? "bg-[#4782BE] text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  Fitur
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "deskripsi" && (
                  <div className="text-neutral-700 leading-relaxed">
                    {service.description}
                  </div>
                )}

                {activeTab === "fitur" && (
                  <div className="space-y-3">
                    {service.features && service.features.length > 0 ? (
                      service.features.map((feature, index) => (
                        <label key={index} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked
                            readOnly
                            className="w-5 h-5 rounded border-neutral-300 text-[#4782BE] focus:ring-[#4782BE]"
                          />
                          <span className="text-neutral-700">{feature}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-neutral-600">Fitur layanan akan segera ditambahkan</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
              {/* Favorite Icon */}
              <div className="flex justify-end mb-4">
                {isClient && (
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={favoriteLoading}
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-all disabled:opacity-50"
                  >
                    {favoriteLoading ? (
                      <i className="fas fa-spinner fa-spin text-neutral-600" />
                    ) : (
                      <i className={`${isFavorite ? 'fas' : 'far'} fa-heart ${isFavorite ? 'text-red-500' : 'text-neutral-600'} text-lg`} />
                    )}
                  </button>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-sm text-neutral-600 mb-1">Mulai dari</div>
                <div className="text-3xl font-bold text-[#4782BE]">
                  Rp {service.price.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1 mb-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span className="font-semibold text-neutral-900">{service.rating}</span>
              </div>
              <div className="text-sm text-neutral-600 mb-3">{service.reviews || 0} reviews</div>
              <div className="text-sm text-neutral-600 mb-4">{service.orders || 0} pesanan</div>

              {/* Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div>
                  <div className="text-sm text-neutral-600">Estimasi pengerjaan</div>
                  <div className="font-semibold text-neutral-900">{service.estimasi || "7-14 hari"}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">{service.revisi || "2x Revisi"}</div>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={handleOrder}
                className="w-full bg-[#4782BE] text-white py-3 rounded-full font-semibold hover:bg-[#1D375B] transition-all hover:shadow-lg mb-3"
              >
                Pesan Sekarang
              </button>

              {/* Additional Info */}
              <div className="text-xs text-neutral-500 text-center">
                Pembayaran dilakukan platform
              </div>
              <div className="text-xs text-neutral-500 text-center">
                Garansi customer service 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <OrderConfirmModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onConfirm={handleConfirmOrder}
        orderData={orderData}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        message="Pesanan Anda akan segera diproses!"
      />

      <FavoriteToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        isFavorite={isFavorite}
      />
    </div>
  );
}
