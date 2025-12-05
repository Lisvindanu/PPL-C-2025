import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CategoryServiceSection from "./CategoryServiceSection";
import { serviceService } from "../../../services/serviceService";

export default function ServicesGrid({ onServiceClick, onCategoryClick, activeFilter }) {
  const [categoriesWithServices, setCategoriesWithServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch categories
        const categoriesResult = await serviceService.getCategories();
        if (!categoriesResult.success || !categoriesResult.categories) {
          throw new Error("Failed to fetch categories");
        }

        // Fetch all services
        const servicesResult = await serviceService.getAllServices({ 
          limit: 100,
          status: "aktif"
        });
        
        if (!servicesResult.success || !servicesResult.services) {
          throw new Error("Failed to fetch services");
        }

        // Group services by category
        const grouped = categoriesResult.categories.map(category => {
          const categoryServices = servicesResult.services
            .filter(service => service.kategori_id === category.id)
            .slice(0, 10) // Limit to 10 services per category for carousel
            .map(service => ({
              id: service.id,
              slug: service.slug,
              title: service.nama_layanan || service.title,
              category: category.nama_kategori || category.title,
              freelancer: service.freelancer_name || service.freelancer || "Unknown",
              rating: parseFloat(service.rating) || 0,
              reviews: parseInt(service.jumlah_ulasan || service.reviews) || 0,
              price: parseInt(service.harga) || 0,
            }));

          return {
            id: category.id,
            title: category.nama_kategori || category.title,
            slug: category.slug,
            services: categoryServices,
          };
        }).filter(cat => cat.services.length > 0); // Only show categories with services

        setCategoriesWithServices(grouped);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch once on mount

  // Filter categories based on activeFilter
  const filteredCategories = activeFilter
    ? categoriesWithServices.filter((cat) => cat.slug === activeFilter)
    : categoriesWithServices;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3">
            <i className="fas fa-spinner fa-spin text-3xl text-[#4782BE]" />
            <p className="text-lg text-neutral-600">Memuat layanan...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4" />
          <p className="text-lg text-red-600">Gagal memuat layanan: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
              {activeFilter ? "Layanan yang Difilter" : "Layanan Terpopuler"}
            </span>
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            {activeFilter
              ? `Menampilkan layanan ${filteredCategories[0]?.title || ""}`
              : "Jelajahi berbagai layanan profesional dari freelancer terbaik"}
          </p>
        </motion.div>

        {/* Categories with Services */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryServiceSection
              key={category.id}
              category={category}
              services={category.services}
              onServiceClick={onServiceClick}
              onCategoryClick={onCategoryClick}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-inbox text-6xl text-neutral-300 mb-4" />
            <p className="text-neutral-600 text-lg">Tidak ada layanan ditemukan</p>
          </div>
        )}
      </div>
    </section>
  );
}
