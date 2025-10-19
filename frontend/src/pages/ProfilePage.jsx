import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button'

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
          const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Profile loaded from database:', result)
            
            if (result.success && result.data) {
              setProfile(prev => ({
                ...prev,
                nama_depan: result.data.nama_depan || prev.nama_depan,
                nama_belakang: result.data.nama_belakang || prev.nama_belakang,
                email: result.data.email || prev.email,
                no_telepon: result.data.no_telepon || prev.no_telepon,
                bio: result.data.bio || prev.bio,
                kota: result.data.kota || prev.kota,
                provinsi: result.data.provinsi || prev.provinsi,
                role: result.data.role || prev.role
              }))
              return
            }
          } else {
            console.error('API Error:', response.status, response.statusText)
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
          const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Profile updated in database:', result)
            
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
            console.error('API Error:', response.status, response.statusText)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Profile' : 'Profile'}
          </h1>
          
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SC</span>
              </div>
              <span className="font-semibold text-gray-900">Skill Connect</span>
            </Link>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <Button variant="neutral" onClick={handleSave} disabled={loading}>
                    Simpan
                  </Button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              <Button variant="outline" onClick={handleLogout} className="text-sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={`${profile.nama_depan} ${profile.nama_belakang}`}
                    onChange={(e) => {
                      const names = e.target.value.split(' ')
                      setProfile(prev => ({
                        ...prev,
                        nama_depan: names[0] || '',
                        nama_belakang: names.slice(1).join(' ') || ''
                      }))
                    }}
                    className="text-2xl font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {profile.nama_depan} {profile.nama_belakang}
                  </h2>
                )}
                {isEditing && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={`${profile.kota}, ${profile.provinsi}`}
                    onChange={(e) => {
                      const location = e.target.value.split(', ')
                      setProfile(prev => ({
                        ...prev,
                        kota: location[0] || '',
                        provinsi: location[1] || ''
                      }))
                    }}
                    className="text-gray-600 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{profile.kota}, {profile.provinsi}</p>
                )}
                {isEditing && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <Button variant="neutral">
                  {isEditing ? 'Simpan' : 'Sewa'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Pekerjaan */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{profile.total_pekerjaan}</span>
                <span className="text-gray-600">Total Pekerjaan</span>
              </div>

              {/* Job Title & Rate */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.judul_profesi}
                      onChange={(e) => setProfile(prev => ({ ...prev, judul_profesi: e.target.value }))}
                      className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-gray-900">{profile.judul_profesi}</h3>
                  )}
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.rate}
                      onChange={(e) => setProfile(prev => ({ ...prev, rate: e.target.value }))}
                      className="text-lg text-green-600 font-semibold border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-lg text-green-600 font-semibold">{profile.rate}</span>
                  )}
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">Peran:</span>
                  {isEditing ? (
                    <select 
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="client">Client</option>
                      <option value="freelancer">Pekerja Lepas</option>
                    </select>
                  ) : (
                    <span className="text-gray-900">{profile.role === 'freelancer' ? 'Pekerja Lepas' : 'Client'}</span>
                  )}
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">About</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <textarea 
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Verification */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Verifikasi</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">ID:</span>
                    <span className="text-green-600 font-medium">Terverifikasi</span>
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Nomor HP:</span>
                    <span className="text-green-600 font-medium">Terverifikasi</span>
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Layanan Saya</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <textarea 
                    value="Buku & Ilustrasi Anak\nBuku cerita & buku bergambar\nDesain lembar karakter\nPapan cerita & strip komik\nSampul buku (depan & belakang)\nBuku & jurnal edukasi\nBuku mewarnai & buku papan\nFormat dan materi KDP\nBuku interaktif & aktivitas\nKartu flash dan buku catatan"
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan layanan yang Anda tawarkan..."
                  />
                ) : (
                  <ul className="space-y-1 text-gray-700">
                    <li>• Buku & Ilustrasi Anak</li>
                    <li>• Buku cerita & buku bergambar</li>
                    <li>• Desain lembar karakter</li>
                    <li>• Papan cerita & strip komik</li>
                    <li>• Sampul buku (depan & belakang)</li>
                    <li>• Buku & jurnal edukasi</li>
                    <li>• Buku mewarnai & buku papan</li>
                    <li>• Format dan materi KDP</li>
                    <li>• Buku interaktif & aktivitas</li>
                    <li>• Kartu flash dan buku catatan</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Language */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Bahasa</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    {profile.bahasa.map((lang, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={lang.name}
                          onChange={(e) => {
                            const newBahasa = [...profile.bahasa]
                            newBahasa[index].name = e.target.value
                            setProfile(prev => ({ ...prev, bahasa: newBahasa }))
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Bahasa"
                        />
                        <select 
                          value={lang.level}
                          onChange={(e) => {
                            const newBahasa = [...profile.bahasa]
                            newBahasa[index].level = e.target.value
                            setProfile(prev => ({ ...prev, bahasa: newBahasa }))
                          }}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Dasar">Dasar</option>
                          <option value="Menengah">Menengah</option>
                          <option value="Fasih">Fasih</option>
                          <option value="Native">Native</option>
                        </select>
                        <button 
                          onClick={() => {
                            const newBahasa = profile.bahasa.filter((_, i) => i !== index)
                            setProfile(prev => ({ ...prev, bahasa: newBahasa }))
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          bahasa: [...prev.bahasa, { name: '', level: 'Dasar' }]
                        }))
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Tambah Bahasa
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.bahasa.map((lang, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700">{lang.name}:</span>
                        <span className="text-gray-900 font-medium">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* License */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Lisensi</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.lisensi}
                    onChange={(e) => setProfile(prev => ({ ...prev, lisensi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan lisensi/sertifikasi Anda"
                  />
                ) : (
                  <p className="text-gray-700">{profile.lisensi}</p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Edukasi</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.pendidikan}
                    onChange={(e) => setProfile(prev => ({ ...prev, pendidikan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan riwayat pendidikan Anda"
                  />
                ) : (
                  <p className="text-gray-700">{profile.pendidikan}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Keahlian</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {profile.keahlian.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          <input 
                            type="text" 
                            value={skill}
                            onChange={(e) => {
                              const newKeahlian = [...profile.keahlian]
                              newKeahlian[index] = e.target.value
                              setProfile(prev => ({ ...prev, keahlian: newKeahlian }))
                            }}
                            className="bg-transparent border-none outline-none text-blue-800 text-sm"
                          />
                          <button 
                            onClick={() => {
                              const newKeahlian = profile.keahlian.filter((_, i) => i !== index)
                              setProfile(prev => ({ ...prev, keahlian: newKeahlian }))
                            }}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          keahlian: [...prev.keahlian, 'Keahlian Baru']
                        }))
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Tambah Keahlian
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.keahlian.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Association */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Asosiasi</h4>
                  {isEditing && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.asosiasi}
                    onChange={(e) => setProfile(prev => ({ ...prev, asosiasi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan asosiasi/organisasi Anda"
                  />
                ) : (
                  <p className="text-gray-700">{profile.asosiasi}</p>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-semibold text-gray-900">Portofolio</h4>
                {isEditing && (
                  <button className="p-1 text-blue-500 hover:text-blue-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative group">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=300&h=200&fit=crop`}
                    alt={`Portfolio ${item}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium text-center px-2">
                      Ilustrasi Buku Cerita untuk Anak-anak - Terbang ke Bulan
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900">Sebelumnya</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900">2</button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900">3</button>
              <span className="px-2 text-gray-400">...</span>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900">10</button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900">Selanjutnya</button>
            </div>
          </div>

          {/* Action Buttons for Edit Mode */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button variant="neutral" onClick={handleSave} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
