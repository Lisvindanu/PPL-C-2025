import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'
import api from '../utils/axiosConfig'

export default function ProfileEditPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    nama_depan: '',
    nama_belakang: '',
    no_telepon: '',
    bio: '',
    kota: '',
    provinsi: '',
    anggaran: '',
    tipe_proyek: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/profile')

      if (response.data.success && response.data.data) {
        const profile = response.data.data
        setFormData({
          nama_depan: profile.nama_depan || '',
          nama_belakang: profile.nama_belakang || '',
          no_telepon: profile.no_telepon || '',
          bio: profile.bio || '',
          kota: profile.kota || '',
          provinsi: profile.provinsi || '',
          anggaran: profile.anggaran || '',
          tipe_proyek: profile.tipe_proyek || ''
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Gagal memuat profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user types
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await api.put('/users/profile', formData)

      if (response.data.success) {
        setSuccess('Profile berhasil diperbarui!')

        // Redirect to profile page after 1.5 seconds
        setTimeout(() => {
          navigate('/profile')
        }, 1500)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err?.response?.data?.message || 'Gagal memperbarui profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Kembali ke Profile
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Perbarui informasi profile Anda</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-user mr-2 text-primary"></i>
                Informasi Pribadi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Depan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    name="nama_depan"
                    value={formData.nama_depan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan nama depan"
                  />
                </div>

                {/* Nama Belakang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    name="nama_belakang"
                    value={formData.nama_belakang}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan nama belakang"
                  />
                </div>

                {/* No Telepon */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="no_telepon"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                Lokasi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota
                  </label>
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: Jakarta"
                  />
                </div>

                {/* Provinsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: DKI Jakarta"
                  />
                </div>
              </div>
            </div>

            {/* Project Preferences (Client specific fields) */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-briefcase mr-2 text-primary"></i>
                Preferensi Proyek
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anggaran */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anggaran
                  </label>
                  <input
                    type="text"
                    name="anggaran"
                    value={formData.anggaran}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: Rp 1.000.000 - Rp 5.000.000"
                  />
                </div>

                {/* Tipe Proyek */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Proyek
                  </label>
                  <input
                    type="text"
                    name="tipe_proyek"
                    value={formData.tipe_proyek}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: Website, Mobile App, Design"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
