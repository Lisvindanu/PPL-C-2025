import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { getServiceById } from "../utils/servicesData";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import ServiceCardItem from "../components/molecules/ServiceCardItem";

export default function SavedPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
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
    loadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSaved = () => {
    try {
      // Load from localStorage
      const savedIds = JSON.parse(localStorage.getItem('saved') || '[]');

      // Get full service data
      const savedServices = savedIds
        .map(id => getServiceById(id))
        .filter(Boolean)
        .map(service => ({ ...service, isSaved: true }));

      setSaved(savedServices);
    } catch (err) {
      console.error("Error loading saved:", err);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (serviceId, isSaved) => {
    // Remove from list if unsaved
    if (!isSaved) {
      setSaved(prev => prev.filter(item => item.id !== serviceId));
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
            <p className="text-neutral-600">Memuat layanan tersimpan...</p>
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Layanan Tersimpan</h1>
          <p className="text-neutral-600">Layanan yang telah Anda simpan untuk dilihat nanti</p>
        </div>

        {/* Empty State */}
        {saved.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <i className="far fa-bookmark text-6xl text-neutral-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Belum Ada Layanan Tersimpan
            </h2>
            <p className="text-neutral-600 mb-6">
              Anda belum menyimpan layanan apapun
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4782BE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D375B] transition-colors"
            >
              Jelajahi Layanan
            </button>
          </div>
        )}

        {/* Saved Grid */}
        {saved.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-neutral-600">
              {saved.length} layanan tersimpan
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saved.map((service) => (
                <ServiceCardItem
                  key={service.id}
                  service={service}
                  onClick={() => handleServiceClick(service)}
                  onSaveToggle={handleSaveToggle}
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
