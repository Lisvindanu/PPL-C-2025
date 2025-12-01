import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'
import ServiceCardItem from '../components/molecules/ServiceCardItem'
import { bookmarkService } from '../services/bookmarkService'
import { favoriteService } from '../services/favoriteService'

const BookmarkPage = () => {
  const navigate = useNavigate()
  const [bookmarkedServices, setBookmarkedServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        console.log('[BookmarkPage] Loading bookmarks from backend...');

        // Fetch bookmarks from backend (with full service details from JOIN)
        const res = await bookmarkService.getBookmarks()

        if (!res.success) {
          console.error('[BookmarkPage] Failed to load bookmarks:', res.message);
          setBookmarkedServices([])
          setLoading(false)
          return
        }

        const bookmarks = res.data || []
        console.log('[BookmarkPage] Loaded bookmarks:', bookmarks.length);

        if (bookmarks.length === 0) {
          setBookmarkedServices([])
          setLoading(false)
          return
        }

        // Extract service IDs
        const serviceIds = bookmarks.map(b => b.id);
        console.log('[BookmarkPage] Service IDs:', serviceIds);

        // Fetch favorite counts for all services
        const countsResult = await favoriteService.getFavoriteCounts(serviceIds);
        console.log('[BookmarkPage] Favorite counts result:', countsResult);

        const favoriteCounts = countsResult.success ? countsResult.data : {};
        console.log('[BookmarkPage] Favorite counts map:', favoriteCounts);

        // Map services with favorite counts and proper formatting
        const servicesWithCounts = bookmarks.map(service => {
          const count = favoriteCounts[service.id] || 0;
          console.log(`[BookmarkPage] Service ${service.id}: favoriteCount = ${count}`);
          return {
            ...service,
            // Ensure price is an integer (remove .00 decimals)
            price: parseInt(service.price) || 0,
            // Ensure rating is a float
            rating: parseFloat(service.rating) || 0,
            // Ensure reviews is an integer
            reviews: parseInt(service.reviews) || 0,
            isSaved: true,
            isBookmarked: true,
            favoriteCount: count
          };
        });

        console.log('[BookmarkPage] Final services with favorite counts:', servicesWithCounts);
        setBookmarkedServices(servicesWithCounts)
      } catch (e) {
        console.error('[BookmarkPage] load error:', e)
        setBookmarkedServices([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleBookmarkToggle = (serviceId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarkedServices(prev => prev.filter(s => s.id !== serviceId))
    }
  }

  const handleServiceClick = (service) => {
    // Use slug as primary route, fallback to ID
    navigate(`/services/${service.slug || service.id}`)
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <i className="fas fa-bookmark text-4xl text-[#4782BE]"></i>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
                  Layanan Tersimpan
                </span>
              </h1>
            </div>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
              Lihat kembali layanan yang telah Anda bookmark untuk referensi di masa depan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Services Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            Menampilkan <span className="font-semibold text-[#4782BE]">{bookmarkedServices.length}</span> layanan tersimpan
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-3xl text-[#4782BE]"></i>
          </div>
        )}

        {/* Services Grid */}
        {!loading && (bookmarkedServices.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {bookmarkedServices.map((service) => (
              <ServiceCardItem
                key={service.id}
                service={{ ...service, isBookmarked: true }}
                onClick={() => handleServiceClick(service)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📑</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Belum ada layanan tersimpan</h3>
            <p className="text-neutral-600 mb-6">
              Bookmark layanan favorit Anda untuk melihatnya kembali nanti
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Jelajahi Layanan
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default BookmarkPage
