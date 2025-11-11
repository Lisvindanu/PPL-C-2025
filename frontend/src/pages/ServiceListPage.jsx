import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'
import ServiceCardItem from '../components/molecules/ServiceCardItem'
import { serviceService } from '../services/serviceService'

// Helper function to map backend service data to frontend format
const mapServiceToFrontend = (backendService) => {
  return {
    id: backendService.id,
    title: backendService.judul || backendService.title || '',
    category: backendService.kategori?.nama_kategori || backendService.category || 'Lainnya',
    categoryId: backendService.kategori?.id || backendService.kategori_id || null,
    freelancer: backendService.freelancer?.nama_lengkap || backendService.freelancer || 'Freelancer',
    rating: backendService.rating_rata_rata || backendService.rating || 0,
    reviews: backendService.jumlah_review || backendService.reviews || 0,
    price: backendService.harga || backendService.price || 0,
    thumbnail: backendService.thumbnail,
    slug: backendService.slug
  }
}

const ServiceListPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch services and categories on component mount
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch categories
        const categoriesResult = await serviceService.getCategories()
        if (cancelled) return;
        
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories)
        }

        // Fetch services with pagination
        // Get first page with max limit (100)
        let allServices = []
        let currentPage = 1
        let hasMore = true
        const limit = 100 // Maximum allowed by backend
        const maxPages = 10 // Safety limit to prevent infinite loops

        while (hasMore && currentPage <= maxPages && !cancelled) {
          const servicesResult = await serviceService.getAllServices({
            page: currentPage,
            limit: limit,
            status: 'aktif'
          })

          if (cancelled) return;

          if (servicesResult.success && servicesResult.services) {
            const mappedServices = servicesResult.services.map(mapServiceToFrontend)
            allServices = [...allServices, ...mappedServices]
            
            // Check if there are more pages
            const pagination = servicesResult.pagination || {}
            if (pagination.totalPages && currentPage < pagination.totalPages) {
              currentPage++
            } else {
              hasMore = false
            }
          } else {
            // If first page fails, show error
            if (currentPage === 1) {
              setError(servicesResult.message || 'Gagal memuat layanan')
            }
            hasMore = false
          }
        }

        if (cancelled) return;

        if (allServices.length > 0) {
          setServices(allServices)
        } else if (currentPage === 1) {
          // Only show error if first page failed
          setError('Tidak ada layanan ditemukan')
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching data:', err)
        setError('Terjadi kesalahan saat memuat data')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [])

  // Handle URL category parameter
  useEffect(() => {
    const categorySlug = searchParams.get('category')
    if (categorySlug && categories.length > 0) {
      // Helper function to slugify category name
      const slugify = (text) => {
        return text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/&/g, '')
          .replace(/[^\w-]+/g, '')
      }

      // Find matching category
      const matchingCategory = categories.find(cat =>
        slugify(cat.nama) === categorySlug
      )

      if (matchingCategory) {
        setSelectedCategory(matchingCategory.id)
      }
    } else if (!categorySlug) {
      // Clear selection if no category in URL
      setSelectedCategory(null)
    }
  }, [searchParams, categories])

  // Filter services by category
  const filteredServices = selectedCategory
    ? services.filter(service => {
        // Check if service belongs to the selected category by ID
        return service.categoryId === selectedCategory
      })
    : services

  const handleServiceClick = (service) => {
    navigate(`/services/${service.id}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
                Jelajahi Layanan Profesional
              </span>
            </h1>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
              Temukan freelancer terbaik untuk proyek Anda dari berbagai kategori layanan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#4782BE] mb-4"></i>
            <p className="text-neutral-600">Memuat layanan...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-neutral-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#4782BE] text-white rounded-full font-medium hover:bg-[#1D375B] transition-all"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Category Filter */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Filter Kategori</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white shadow-lg'
                      : 'bg-[#D8E3F3] text-[#1D375B] hover:bg-[#4782BE]/20'
                  }`}
                >
                  Semua Layanan
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white shadow-lg'
                        : 'bg-[#D8E3F3] text-[#1D375B] hover:bg-[#4782BE]/20'
                    }`}
                  >
                    {category.nama}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Count */}
            <div className="mb-6">
              <p className="text-neutral-600">
                Menampilkan <span className="font-semibold text-[#4782BE]">{filteredServices.length}</span> layanan
                {selectedCategory && (
                  <span>
                    {' '}dalam kategori{' '}
                    <span className="font-semibold text-[#1D375B]">
                      {categories.find(cat => cat.id === selectedCategory)?.nama}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredServices.map((service) => (
                <ServiceCardItem
                  key={service.id}
                  service={service}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredServices.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Tidak ada layanan ditemukan</h3>
                <p className="text-neutral-600">Coba pilih kategori lain atau lihat semua layanan</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ServiceListPage
