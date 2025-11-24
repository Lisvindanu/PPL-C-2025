import { useState, useEffect } from 'react'
import ProfileLayout from '../components/templates/ProfileLayout'
import ProfileLoadingOverlay from '../components/organisms/ProfileLoadingOverlay'
import api from '../utils/axiosConfig'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    nama_depan: 'Talitha',
    nama_belakang: 'Riski',
    email: 'talitha@example.com',
    no_telepon: '+6281234567890',
    bio: 'Halo, saya Riski! Saya seorang ilustrator lepas dengan pengalaman lebih dari 6 tahun dan rekam jejak yang terbukti telah menyelesaikan lebih dari 100 proyek buku dan ilustrasi yang sukses. Baik itu cerita bertema keluarga, fabel, dunia fantasi yang unik, atau konten edukasi yang menyenangkan, saya menghidupkan ide-ide melalui visual yang penuh warna, ekspresif, dan menyentuh hati yang menginspirasi anak-anak dan pembaca dari segala usia.',
    kota: 'Bandung',
    provinsi: 'Jawa Barat',
    role: 'freelancer',
    judul_profesi: 'Ilustrator Ahli untuk Buku Anak',
    rate: 'Rp. 50.000/Jam',
    total_pekerjaan: 37,
    keahlian: ['Logo Design', 'Illustration', 'Children Book Design', 'Character Design'],
    bahasa: [
      { name: 'Inggris', level: 'Dasar' },
      { name: 'Indonesia', level: 'Fasih' }
    ],
    lisensi: 'BNSP Animator',
    pendidikan: 'S1 - Animasi Unpar',
    asosiasi: 'PT Illustrasi Indonesia',
    verifikasi: {
      id: true,
      phone: true
    }
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      // Try to load from API first
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/users/profile')

          if (response.data.success && response.data.data) {
            setProfile(prev => ({
              ...prev,
              nama_depan: response.data.data.nama_depan || prev.nama_depan,
              nama_belakang: response.data.data.nama_belakang || prev.nama_belakang,
              email: response.data.data.email || prev.email,
              no_telepon: response.data.data.no_telepon || prev.no_telepon,
              bio: response.data.data.bio || prev.bio,
              kota: response.data.data.kota || prev.kota,
              provinsi: response.data.data.provinsi || prev.provinsi,
              role: response.data.data.role || prev.role
            }))
            return
          }
        } catch (apiError) {
          console.error('API Error:', apiError)
          console.log('Falling back to localStorage')
        }
      }

      // Fallback: Load data from localStorage
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
      if (user) {
        setProfile(prev => ({
          ...prev,
          nama_depan: user.nama_depan || prev.nama_depan,
          nama_belakang: user.nama_belakang || prev.nama_belakang,
          email: user.email || prev.email,
          role: user.role || prev.role
        }))
      }
      console.log('Profile loaded from localStorage')
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      // Prepare data for API
      const updateData = {
        nama_depan: profile.nama_depan,
        nama_belakang: profile.nama_belakang,
        email: profile.email,
        no_telepon: profile.no_telepon,
        bio: profile.bio,
        kota: profile.kota,
        provinsi: profile.provinsi,
        role: profile.role
      }

      // Try to update via API first
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.put('/users/profile', updateData)

          if (response.data.success) {
            console.log('Profile updated in database:', response.data)

            // Update localStorage with new data
            const user = JSON.parse(localStorage.getItem('user') || 'null')
            if (user) {
              const updatedUser = { ...user, ...updateData }
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }

            alert('Profile updated successfully in database!')
            setIsEditing(false)
            return
          } else {
            throw new Error('API request failed')
          }
        } catch (apiError) {
          console.error('API Error:', apiError)
          // Fallback to localStorage only
          console.log('Falling back to localStorage only')
        }
      }

      // Fallback: Update localStorage only
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
      if (user) {
        const updatedUser = { ...user, ...updateData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        alert('Profile updated in local storage (database connection failed)')
        setIsEditing(false)
      } else {
        alert('No user data found')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    loadProfile()
    setIsEditing(false)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }

  const handleProfileChange = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  return (
    <>
      <ProfileLoadingOverlay loading={loading} />
      <ProfileLayout
        profile={profile}
        isEditing={isEditing}
        loading={loading}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onLogout={handleLogout}
        onProfileChange={handleProfileChange}
      />
    </>
  )
}
