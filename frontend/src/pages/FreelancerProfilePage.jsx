import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/organisms/Navbar"
import Footer from "../components/organisms/Footer"
import api from "../utils/axiosConfig"

export default function FreelancerProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [freelancer, setFreelancer] = useState(null)
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)

  useEffect(() => {
    if (id) {
      loadFreelancerProfile()
      loadFreelancerServices()
    }
  }, [id])

  const loadFreelancerProfile = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get(`/users/${id}`)

      if (response.data.success && response.data.data) {
        const userData = response.data.data

        // Only allow viewing freelancer profiles
        if (userData.role !== "freelancer") {
          setError("Profile ini bukan freelancer")
          return
        }

        setFreelancer(userData)
      } else {
        setError("Profile tidak ditemukan")
      }
    } catch (err) {
      console.error("Error loading freelancer profile:", err)
      setError(err?.response?.data?.message || "Gagal memuat profile freelancer")
    } finally {
      setLoading(false)
    }
  }

  const loadFreelancerServices = async () => {
    try {
      setLoadingServices(true)
      const response = await api.get(`/services?freelancer_id=${id}&status=aktif`)
      
      if (response.data.status === "success" && response.data.data) {
        setServices(response.data.data.items || [])
      }
    } catch (err) {
      console.error("Error loading freelancer services:", err)
    } finally {
      setLoadingServices(false)
    }
  }

  const handleServiceClick = (slug) => {
    navigate(`/services/${slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profile freelancer...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !freelancer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
              <p className="text-red-600 font-medium text-lg mb-4">⚠️ {error || "Profile tidak ditemukan"}</p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const fullName = `${freelancer.nama_depan || ''} ${freelancer.nama_belakang || ''}`.trim() || freelancer.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-primaryDark px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-primary">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                <p className="text-xl opacity-90 mb-3">
                  {freelancer.profil_freelancer?.judul_profesi || "Freelancer Professional"}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {freelancer.profil_freelancer?.kota || "Indonesia"}
                  </span>
                  {freelancer.profil_freelancer?.rate && (
                    <span className="flex items-center">
                      <i className="fas fa-dollar-sign mr-2"></i>
                      {freelancer.profil_freelancer.rate}
                    </span>
                  )}
                  {freelancer.is_verified && (
                    <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <i className="fas fa-check-circle mr-2"></i>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bio */}
                {freelancer.bio && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-user-circle mr-2 text-primary"></i>
                      Tentang Saya
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{freelancer.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {freelancer.profil_freelancer?.keahlian && freelancer.profil_freelancer.keahlian.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-tools mr-2 text-primary"></i>
                      Keahlian
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.profil_freelancer.keahlian.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {freelancer.profil_freelancer?.bahasa && freelancer.profil_freelancer.bahasa.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-language mr-2 text-primary"></i>
                      Bahasa
                    </h2>
                    <div className="space-y-2">
                      {freelancer.profil_freelancer.bahasa.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-900">{lang.name}</span>
                          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                            {lang.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Description */}
                {freelancer.profil_freelancer?.deskripsi_lengkap && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-file-alt mr-2 text-primary"></i>
                      Deskripsi Lengkap
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {freelancer.profil_freelancer.deskripsi_lengkap}
                      </p>
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {(freelancer.profil_freelancer?.portfolio_url ||
                  freelancer.profil_freelancer?.judul_portfolio ||
                  freelancer.profil_freelancer?.file_portfolio) && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-folder-open mr-2 text-primary"></i>
                      Portfolio
                    </h2>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 space-y-4">
                      {freelancer.profil_freelancer.judul_portfolio && (
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-2">
                            {freelancer.profil_freelancer.judul_portfolio}
                          </h3>
                          {freelancer.profil_freelancer.deskripsi_portfolio && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {freelancer.profil_freelancer.deskripsi_portfolio}
                            </p>
                          )}
                        </div>
                      )}

                      {freelancer.profil_freelancer.portfolio_url && (
                        <div>
                          <a
                            href={freelancer.profil_freelancer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Lihat Portfolio
                          </a>
                        </div>
                      )}

                      {freelancer.profil_freelancer.file_portfolio &&
                       Array.isArray(freelancer.profil_freelancer.file_portfolio) &&
                       freelancer.profil_freelancer.file_portfolio.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">File Portfolio:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {freelancer.profil_freelancer.file_portfolio.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={file.startsWith("http") ? file : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/public/${file}`}
                                  alt={`Portfolio ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/200x150?text=Portfolio"
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Offered */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-briefcase mr-2 text-primary"></i>
                    Layanan yang Ditawarkan
                  </h2>
                  {loadingServices ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600 text-sm">Memuat layanan...</p>
                    </div>
                  ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceClick(service.slug)}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start space-x-3">
                            {service.thumbnail && (
                              <img
                                src={service.thumbnail.startsWith("http") ? service.thumbnail : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/public/${service.thumbnail}`}
                                alt={service.judul}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = "none"
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{service.judul}</h3>
                              <p className="text-xs text-gray-500 mt-1">{service.nama_kategori}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-primary font-bold">
                                  Rp {new Intl.NumberFormat("id-ID").format(service.harga)}
                                </span>
                                <div className="flex items-center text-xs text-gray-500">
                                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                                  {service.rating_rata_rata || "0.0"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <i className="fas fa-inbox text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">Belum ada layanan yang ditawarkan</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-6">
                {/* Stats Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Statistik</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Pekerjaan</span>
                      <span className="font-bold text-primary">
                        {freelancer.profil_freelancer?.total_pekerjaan || 0}
                      </span>
                    </div>

                    {freelancer.profil_freelancer?.total_pekerjaan_selesai !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pekerjaan Selesai</span>
                        <span className="font-bold text-green-600">
                          {freelancer.profil_freelancer.total_pekerjaan_selesai}
                        </span>
                      </div>
                    )}

                    {freelancer.profil_freelancer?.rating_rata_rata !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span className="font-bold text-gray-900">
                            {Number(freelancer.profil_freelancer.rating_rata_rata).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    {freelancer.profil_freelancer?.total_ulasan !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Ulasan</span>
                        <span className="font-bold text-gray-900">
                          {freelancer.profil_freelancer.total_ulasan}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-bold text-gray-900">
                        {new Date(freelancer.created_at).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Education & Certification */}
                {(freelancer.profil_freelancer?.pendidikan || freelancer.profil_freelancer?.lisensi) && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Pendidikan & Sertifikasi</h3>
                    <div className="space-y-3">
                      {freelancer.profil_freelancer.pendidikan && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pendidikan</p>
                          <p className="text-sm font-medium text-gray-900">
                            {freelancer.profil_freelancer.pendidikan}
                          </p>
                        </div>
                      )}
                      {freelancer.profil_freelancer.lisensi && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Lisensi</p>
                          <p className="text-sm font-medium text-gray-900">
                            {freelancer.profil_freelancer.lisensi}
                          </p>
                        </div>
                      )}
                      {freelancer.profil_freelancer.asosiasi && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Asosiasi</p>
                          <p className="text-sm font-medium text-gray-900">
                            {freelancer.profil_freelancer.asosiasi}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Informasi Kontak</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <i className="fas fa-envelope text-primary mt-1 mr-3"></i>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {freelancer.email}
                        </p>
                      </div>
                    </div>
                    {freelancer.no_telepon && (
                      <div className="flex items-start">
                        <i className="fas fa-phone text-primary mt-1 mr-3"></i>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Telepon</p>
                          <p className="text-sm font-medium text-gray-900">
                            {freelancer.no_telepon}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
