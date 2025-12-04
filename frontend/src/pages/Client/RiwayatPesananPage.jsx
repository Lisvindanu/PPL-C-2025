import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import OrderCard from "../../components/molecules/OrderCard";
import RatingModal from "../../components/organisms/RatingModal";
import SuccessModal from "../../components/molecules/SuccessModal";

export default function RiwayatPesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleRate = (order) => {
    setSelectedOrder(order);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (ratingData) => {
    // TODO: Send to API
    console.log("Rating submitted:", ratingData);

    // Update local state
    const updatedOrders = orders.map((order) =>
      order.id === ratingData.orderId
        ? {
            ...order,
            rated: true,
            rating: Math.round(ratingData.averageRating),
          }
        : order
    );

    setOrders(updatedOrders);

    // Update localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Close rating modal and show success modal
    setIsRatingModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <a
                href="/"
                className="text-sm hover:underline inline-flex items-center gap-2"
              >
                <i className="fas fa-arrow-left" />
                Kembali ke daftar layanan
              </a>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white px-4 py-1 rounded-full">
                <span className="text-[#1D375B] font-semibold text-sm">Website</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Riwayat Pesanan</h1>
          </motion.div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-6xl text-neutral-300 mb-4" />
              <p className="text-neutral-600 text-lg">Memuat pesanan...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} onRate={handleRate} />
            ))
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-inbox text-6xl text-neutral-300 mb-4" />
              <p className="text-neutral-600 text-lg">Belum ada pesanan</p>
              <p className="text-neutral-500 text-sm mt-2">Mulai pesan layanan dari freelancer terbaik!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        order={selectedOrder}
        onSubmit={handleRatingSubmit}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        message="Terimakasih masukannya!"
      />
    </div>
  );
}
