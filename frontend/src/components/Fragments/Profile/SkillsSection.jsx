import TextField from '../../Elements/Inputs/TextField'
import Icon from '../../Elements/Icons/Icon'
import SkillTag from './SkillTag'
import LanguageItem from './LanguageItem'

export default function SkillsSection({ 
  profile, 
  isEditing, 
  onProfileChange 
}) {
  const addSkill = () => {
    onProfileChange({
      keahlian: [...profile.keahlian, 'Keahlian Baru']
    })
  }

  const updateSkill = (index, newSkill) => {
    const newKeahlian = [...profile.keahlian]
    newKeahlian[index] = newSkill
    onProfileChange({ keahlian: newKeahlian })
  }

  const removeSkill = (index) => {
    const newKeahlian = profile.keahlian.filter((_, i) => i !== index)
    onProfileChange({ keahlian: newKeahlian })
  }

  const addLanguage = () => {
    onProfileChange({
      bahasa: [...profile.bahasa, { name: '', level: 'Dasar' }]
    })
  }

  const updateLanguage = (index, updatedLanguage) => {
    const newBahasa = [...profile.bahasa]
    newBahasa[index] = updatedLanguage
    onProfileChange({ bahasa: newBahasa })
  }

  const removeLanguage = (index) => {
    const newBahasa = profile.bahasa.filter((_, i) => i !== index)
    onProfileChange({ bahasa: newBahasa })
  }

  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Bahasa</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <div className="space-y-3">
            {profile.bahasa.map((lang, index) => (
              <LanguageItem
                key={index}
                language={lang}
                isEditing={isEditing}
                onLanguageChange={(updatedLang) => updateLanguage(index, updatedLang)}
                onRemove={() => removeLanguage(index)}
              />
            ))}
            <button 
              onClick={addLanguage}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              + Tambah Bahasa
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {profile.bahasa.map((lang, index) => (
              <LanguageItem
                key={index}
                language={lang}
                isEditing={isEditing}
              />
            ))}
          </div>
        )}
      </div>

      {/* License */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Lisensi</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <TextField 
            value={profile.lisensi}
            onChange={(e) => onProfileChange({ lisensi: e.target.value })}
            placeholder="Masukkan lisensi/sertifikasi Anda"
            variant="filled"
          />
        ) : (
          <p className="text-gray-700">{profile.lisensi}</p>
        )}
      </div>

      {/* Education */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Edukasi</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <TextField 
            value={profile.pendidikan}
            onChange={(e) => onProfileChange({ pendidikan: e.target.value })}
            placeholder="Masukkan riwayat pendidikan Anda"
            variant="filled"
          />
        ) : (
          <p className="text-gray-700">{profile.pendidikan}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Keahlian</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {profile.keahlian.map((skill, index) => (
                <SkillTag
                  key={index}
                  skill={skill}
                  isEditing={isEditing}
                  onSkillChange={(newSkill) => updateSkill(index, newSkill)}
                  onRemove={() => removeSkill(index)}
                />
              ))}
            </div>
            <button 
              onClick={addSkill}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              + Tambah Keahlian
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.keahlian.map((skill, index) => (
              <SkillTag
                key={index}
                skill={skill}
                isEditing={isEditing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Association */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Asosiasi</h4>
          {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
        </div>
        {isEditing ? (
          <TextField 
            value={profile.asosiasi}
            onChange={(e) => onProfileChange({ asosiasi: e.target.value })}
            placeholder="Masukkan asosiasi/organisasi Anda"
            variant="filled"
          />
        ) : (
          <p className="text-gray-700">{profile.asosiasi}</p>
        )}
      </div>
    </div>
  )
}
