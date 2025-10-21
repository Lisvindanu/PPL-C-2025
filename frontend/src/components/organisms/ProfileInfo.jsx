import TextField from '../atoms/TextField'
import TextArea from '../atoms/TextArea'
import Select from '../atoms/Select'
import Icon from '../atoms/Icon'
import VerificationBadge from '../molecules/VerificationBadge'

export default function ProfileInfo({ 
  profile, 
  isEditing, 
  onProfileChange 
}) {
  const roleOptions = [
    { value: 'client', label: 'Client' },
    { value: 'freelancer', label: 'Pekerja Lepas' }
  ]

  return (
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
            <TextField 
              value={profile.judul_profesi}
              onChange={(e) => onProfileChange({ judul_profesi: e.target.value })}
              className="text-xl font-semibold text-gray-900 flex-1"
              variant="default"
            />
          ) : (
            <h3 className="text-xl font-semibold text-gray-900">{profile.judul_profesi}</h3>
          )}
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <TextField 
              value={profile.rate}
              onChange={(e) => onProfileChange({ rate: e.target.value })}
              className="text-lg text-green-600 font-semibold"
              variant="default"
            />
          ) : (
            <span className="text-lg text-green-600 font-semibold">{profile.rate}</span>
          )}
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Peran:</span>
          {isEditing ? (
            <Select 
              value={profile.role}
              onChange={(e) => onProfileChange({ role: e.target.value })}
              options={roleOptions}
            />
          ) : (
            <span className="text-gray-900">{profile.role === 'freelancer' ? 'Pekerja Lepas' : 'Client'}</span>
          )}
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">About</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <TextArea 
            value={profile.bio}
            onChange={(e) => onProfileChange({ bio: e.target.value })}
            rows={6}
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Verification */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Verifikasi</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        <div className="space-y-2">
          <VerificationBadge type="id" isVerified={profile.verifikasi?.id} />
          <VerificationBadge type="phone" isVerified={profile.verifikasi?.phone} />
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Layanan Saya</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <TextArea 
            value="Buku & Ilustrasi Anak\nBuku cerita & buku bergambar\nDesain lembar karakter\nPapan cerita & strip komik\nSampul buku (depan & belakang)\nBuku & jurnal edukasi\nBuku mewarnai & buku papan\nFormat dan materi KDP\nBuku interaktif & aktivitas\nKartu flash dan buku catatan"
            rows={10}
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
  )
}
