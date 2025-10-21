import React, { useState } from 'react'
import { User, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ServiceCard from '../components/organisms/ServiceCard'
import { useToast } from '../components/organisms/ToastProvider'

const BookmarkPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [bookmarkedServiceIds, setBookmarkedServiceIds] = useState(new Set([1, 2, 3]))
  
  const bookmarkedServices = [
    {
      id: 1,
      title: "Figma Designer",
      description: "We are looking for figma designers who can help designing the entire mobile application with modern UI/UX principles.",
      price: 2500,
      currency: "USD",
      period: "month",
      tags: ["UI Designer", "Figma", "Landing Page"],
      type: "Part-time",
      posted: "1 Day Ago",
      freelancer: {
        name: "John Doe",
        avatar: "/api/placeholder/40/40",
        rating: 4.8,
        reviews: 127
      },
      thumbnail: "https://cdn.thenewstack.io/media/2022/05/600b72f9-react.png",
      isBookmarked: true
    },
    {
      id: 2,
      title: "React Developer",
      description: "Looking for experienced React developer to build responsive web applications with modern frameworks.",
      price: 1800,
      currency: "USD", 
      period: "month",
      tags: ["React", "JavaScript", "Frontend"],
      type: "Full-time",
      posted: "2 Days Ago",
      freelancer: {
        name: "Jane Smith",
        avatar: "/api/placeholder/40/40",
        rating: 4.9,
        reviews: 89
      },
      thumbnail: "https://cdn.thenewstack.io/media/2022/05/600b72f9-react.png",
      isBookmarked: true
    },
    {
      id: 3,
      title: "Logo Design",
      description: "Professional logo design services for your brand. Modern, clean, and memorable designs.",
      price: 150,
      currency: "USD",
      period: "project",
      tags: ["Logo Design", "Branding", "Illustration"],
      type: "Project",
      posted: "3 Days Ago",
      freelancer: {
        name: "Mike Johnson",
        avatar: "/api/placeholder/40/40",
        rating: 4.7,
        reviews: 203
      },
      thumbnail: "https://cdn.thenewstack.io/media/2022/05/600b72f9-react.png",
      isBookmarked: true
    }
  ]

  const handleBookmark = (serviceId) => {
    setBookmarkedServiceIds(prev => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(serviceId)) {
        newBookmarks.delete(serviceId)
        toast.show('Layanan dihapus dari bookmark', 'info')
      } else {
        newBookmarks.add(serviceId)
        toast.show('Layanan ditambahkan ke bookmark', 'success')
      }
      return newBookmarks
    })
  }

  const handleOrderPageRedirect = () => {
    navigate('/orders')
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-text">Skill Connect</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-textMuted hover:text-primary transition-colors">Beranda</a>
              <a href="#" className="text-textMuted hover:text-primary transition-colors">Layanan</a>
              <a href="#" className="text-primary font-medium">Bookmark</a>
              <button 
                onClick={handleOrderPageRedirect}
                className="text-textMuted hover:text-primary transition-colors"
              >
                Pesanan
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-6 h-6 text-text" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-title font-bold text-text mb-6">
              Layanan Disimpan
            </h1>
            <p className="text-lg text-textLight mb-4">
              Layanan yang telah Anda bookmark untuk referensi di masa mendatang
            </p>
            <p className="text-lg text-textLight">
              {bookmarkedServiceIds.size} Layanan disimpan
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {bookmarkedServiceIds.size === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Belum Ada Bookmark</h3>
                <p className="text-textMuted mb-4">Layanan yang Anda bookmark akan muncul di sini</p>
                <button 
                  onClick={handleOrderPageRedirect}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primaryDark transition-colors"
                >
                  Jelajahi Layanan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarkedServices
                  .filter(service => bookmarkedServiceIds.has(service.id))
                  .map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={() => console.log('Service selected:', service.title)}
                      onBookmark={() => handleBookmark(service.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Kategori</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">All Courses</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Marketing</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Graphic Design</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Web</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Writing</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Business</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Video & Photography</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Programs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Jelajahi Skill Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Link Cepat ke Layanan</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Untuk Freelancer</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Untuk Klien</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Dukungan & Bantuan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Pertanyaan Umum</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Kontak Kami</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Pusat Bantuan</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Informasi</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-textMuted hover:text-text transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-textMuted hover:text-text transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-textMuted hover:text-text transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <ul className="space-y-2">
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-textMuted hover:text-text transition-colors">Kebijakan Pembayaran</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-textMuted">© Skill Connect.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BookmarkPage
