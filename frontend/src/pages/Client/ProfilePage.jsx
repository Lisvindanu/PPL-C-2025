import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Fragments/Common/Navbar'
import Footer from '../../components/Fragments/Common/Footer'
import ConfirmModal from '../../components/Elements/Common/ConfirmModal'
import { authService } from '../../services/authService'
import { useToast } from '../../components/Fragments/Common/ToastProvider'
import api from '../../utils/axiosConfig'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/profile')
      
      if (response.data.success && response.data.data) {
        setProfile(response.data.data)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Gagal memuat profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // kept for backward-compatibility; prefer confirmation modal
    authService.logout();
    navigate('/login')
  }

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toast = useToast();

  const performLogout = async () => {
    try {
      await authService.logout();
      toast.show && toast.show('Anda telah logout', 'success');
    } catch (e) {
      // ignore
    } finally {
      setShowLogoutModal(false);
      navigate('/login');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error || 'Profile tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  const fullName = `${profile.nama_depan || ''} ${profile.nama_belakang || ''}`.trim() || profile.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Halo, {fullName}! 👋</h1>
          <p className="text-gray-600">Selamat datang di dashboard profile Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informasi Profile</h2>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </button>
              </div>

              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {fullName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h3>
                  <p className="text-gray-600 mb-3">{profile.email}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {profile.role === 'freelancer' ? 'Freelancer' : 'Client'}
                    </span>
                    {profile.is_verified && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <i className="fas fa-check-circle mr-1"></i>
                        Verified
                      </span>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Kontak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Nomor Telepon</label>
                  <p className="text-gray-900">{profile.no_telepon || 'Belum diisi'}</p>
                </div>
              </div>
            </div>

            {/* Freelancer Specific Info */}
            {profile.role === 'freelancer' && profile.profil_freelancer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Profesional</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Profesi</label>
                    <p className="text-gray-900">{profile.profil_freelancer.judul_profesi || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Rate</label>
                    <p className="text-gray-900 font-semibold">{profile.profil_freelancer.rate || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Lokasi</label>
                    <p className="text-gray-900">{profile.profil_freelancer.kota || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Total Pekerjaan</label>
                    <p className="text-gray-900">{profile.profil_freelancer.total_pekerjaan || 0} project</p>
                  </div>
                </div>

                {/* Skills */}
                {profile.profil_freelancer.keahlian && profile.profil_freelancer.keahlian.length > 0 && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-500 block mb-2">Keahlian</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.profil_freelancer.keahlian.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/freelancer/${profile.id}`)}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-eye text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Lihat Profile Publik</p>
                    <p className="text-xs text-gray-500">Preview profile Anda</p>
                  </div>
                </button>

                {profile.role === 'freelancer' && (
                  <button
                    onClick={() => navigate('/freelance/service')}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                      <i className="fas fa-briefcase text-green-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Kelola Layanan</p>
                      <p className="text-xs text-gray-500">Services yang Anda tawarkan</p>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => navigate('/orders')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                    <i className="fas fa-shopping-cart text-purple-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Pesanan</p>
                    <p className="text-xs text-gray-500">Riwayat pesanan Anda</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full p-3 border border-red-200 rounded-lg hover:bg-red-50 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center">
                    <i className="fas fa-sign-out-alt text-red-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-600 text-sm">Logout</p>
                    <p className="text-xs text-red-500">Keluar dari akun</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistik Akun</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Aktif
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600">Bergabung</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile.created_at ? new Date(profile.created_at).getFullYear() : '-'}
                  </span>
                </div>
                {profile.role === 'freelancer' && profile.profil_freelancer && (
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Total Project</span>
                    <span className="text-sm font-bold text-blue-600">
                      {profile.profil_freelancer.total_pekerjaan || 0}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verifikasi</span>
                  {profile.is_verified ? (
                    <span className="text-sm text-green-600 font-medium">
                      <i className="fas fa-check-circle mr-1"></i>
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Belum
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ConfirmModal
        open={showLogoutModal}
        title="Konfirmasi Logout"
        message="Anda akan keluar dari akun. Apakah Anda yakin ingin melanjutkan?"
        onConfirm={performLogout}
        onCancel={() => setShowLogoutModal(false)}
        confirmText="Ya, keluar"
        cancelText="Batal"
      />
    </div>
  )
}
