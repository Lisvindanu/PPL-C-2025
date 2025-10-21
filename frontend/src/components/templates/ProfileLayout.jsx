import ProfileHeader from '../molecules/ProfileHeader'
import InfoCard from '../molecules/InfoCard'
import ProfileInfo from '../organisms/ProfileInfo'
import SkillsSection from '../organisms/SkillsSection'
import PortfolioSection from '../organisms/PortfolioSection'
import EditForm from '../organisms/EditForm'

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
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader 
        profile={profile}
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={onSave}
        onLogout={onLogout}
        loading={loading}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <InfoCard 
          profile={profile}
          isEditing={isEditing}
          onProfileChange={onProfileChange}
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
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

          <PortfolioSection isEditing={isEditing} />

          <EditForm 
            isEditing={isEditing}
            loading={loading}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  )
}
