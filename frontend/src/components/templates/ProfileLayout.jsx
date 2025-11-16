import Navbar from '../organisms/Navbar'
import InfoCard from '../molecules/InfoCard'
import ProfileInfo from '../organisms/ProfileInfo'
import SkillsSection from '../organisms/SkillsSection'
import PortfolioSection from '../organisms/PortfolioSection'
import EditForm from '../organisms/EditForm'

// Impor komponen baru untuk Umpan Balik Klien
import FeedbackCard from '../molecules/FeedbackCard' 
import Pagination from '../molecules/Pagination'

export default function ProfileLayout({
  profile,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  onLogout,
  onProfileChange
}) {
  
  // Data statis untuk umpan balik (ini hanya contoh)
  const feedbackData = [
    {
      id: 1,
      name: 'Albert',
      company: 'Perusahaan Pemasaran Verizon',
      date: 'Agustus 17, 2025',
      rating: 4.0,
      reviewText: 'Pekerjaan yang bagus dengan komunikasi yang jelas dan pengiriman tepat waktu.',
    },
    {
      id: 2,
      name: 'Jason S.',
      company: 'Perusahaan Pemasaran Verizon',
      date: 'Agustus 17, 2025',
      rating: 5.0,
      reviewText: 'Seperti biasa, bekerja sama dengan Jason selalu menyenangkan, dan saya yakin akan mempekerjakannya lagi di masa depan!',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <InfoCard 
          profile={profile}
          isEditing={isEditing}
          onProfileChange={onProfileChange}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileInfo 
              profile={profile}
              isEditing={isEditing}
              onProfileChange={onProfileChange}
            />

            <SkillsSection 
              profile={profile}
              isEditing={isEditing}
              onProfileChange={onProfileChange}
            />
          </div>

          {/* Logika TAMPIL/SEMBUNYIKAN */}
          {!isEditing ? (
            // JIKA TIDAK SEDANG EDIT: Tampilkan Portofolio & Umpan Balik
            <>
              <PortfolioSection isEditing={isEditing} />
              
              {/* --- Awal Blok Umpan Balik Klien --- */}
              <div className="mt-12">

                {/* Tidak ada <Pagination /> di sini. 
                  Kita letakkan HANYA di bawah.
                */}
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Umpan Balik Klien
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {feedbackData.map((feedback) => (
                    <FeedbackCard
                      key={feedback.id}
                      name={feedback.name}
                      company={feedback.company}
                      date={feedback.date}
                      rating={feedback.rating}
                      reviewText={feedback.reviewText}
                    />
                  ))}
                </div>

                {/* INI DIA! Satu-satunya penomoran halaman,
                  berada di bagian paling bawah.
                */}
                <div className="mt-12">
                  <Pagination />
                </div>

              </div>
              {/* --- Akhir Blok Umpan Balik Klien --- */}
            </>
          ) : (
            // JIKA SEDANG EDIT: Tampilkan Form Edit
            <EditForm 
              isEditing={isEditing}
              loading={loading}
              onSave={onSave}
              onCancel={onCancel}
            />
          )}
        </div>
      </div>
    </div>
  )
}