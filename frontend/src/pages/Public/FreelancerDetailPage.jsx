import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileLayout from '../../components/templates/ProfileLayout'
import ProfileLoadingOverlay from '../../components/organisms/ProfileLoadingOverlay'
import api from '../../utils/axiosConfig'

export default function FreelancerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (id) {
      loadFreelancerProfile()
    }
  }, [id])

  const loadFreelancerProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/users/${id}`)

      if (response.data.success && response.data.data) {
        const userData = response.data.data

        // Only allow viewing freelancer profiles
        if (userData.role !== 'freelancer') {
          setError('Profile ini bukan freelancer')
          setLoading(false)
          return
        }

        // Map API response to profile format expected by ProfileLayout
        const profileData = {
          nama_depan: userData.nama_depan || '',
          nama_belakang: userData.nama_belakang || '',
          email: userData.email || '',
          no_telepon: userData.no_telepon || '',
          bio: userData.bio || '',
          kota: userData.kota || '',
          provinsi: userData.provinsi || '',
          role: userData.role || 'freelancer',
          judul_profesi: userData.profil_freelancer?.judul_profesi || '',
          rate: userData.profil_freelancer?.rate || '',
          total_pekerjaan: userData.profil_freelancer?.total_pekerjaan || 0,
          keahlian: userData.profil_freelancer?.keahlian || [],
          bahasa: userData.profil_freelancer?.bahasa || [],
          lisensi: userData.profil_freelancer?.lisensi || '',
          pendidikan: userData.profil_freelancer?.pendidikan || '',
          asosiasi: userData.profil_freelancer?.asosiasi || '',
          verifikasi: {
            id: userData.is_verified || false,
            phone: userData.is_verified || false
          }
        }

        setProfile(profileData)
      } else {
        setError('Profile tidak ditemukan')
      }
    } catch (err) {
      console.error('Error loading freelancer profile:', err)
      setError(err?.response?.data?.message || 'Gagal memuat profile freelancer')
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk kembali (tidak ada edit/save untuk viewing freelancer lain)
  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return <ProfileLoadingOverlay loading={true} />
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
            <p className="text-red-600 font-medium text-lg mb-4">⚠️ {error || 'Profile tidak ditemukan'}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ProfileLoadingOverlay loading={loading} />
      <ProfileLayout
        profile={profile}
        isEditing={false}  // Always read-only for viewing other freelancers
        loading={loading}
        onEdit={null}  // No edit button
        onSave={null}  // No save function
        onCancel={handleBack}  // Cancel becomes "Back"
        onLogout={null}  // No logout for viewing others
        onProfileChange={null}  // No profile changes allowed
        isViewingOther={true}  // Flag to indicate we're viewing another user
      />
    </>
  )
}
