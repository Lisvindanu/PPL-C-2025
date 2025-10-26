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
      {/* Header */}
      <ProfileHeader 
        profile={profile}
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={onSave}
        onLogout={onLogout}
        loading={loading}
      />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <InfoCard 
            profile={profile}
            isEditing={isEditing}
            onProfileChange={onProfileChange}
          />
        </div>

        {/* Profile Info + Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
            <ProfileInfo 
              profile={profile}
              isEditing={isEditing}
              onProfileChange={onProfileChange}
            />
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <SkillsSection 
              profile={profile}
              isEditing={isEditing}
              onProfileChange={onProfileChange}
            />
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PortfolioSection isEditing={isEditing} />
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <EditForm 
              isEditing={isEditing}
              loading={loading}
              onSave={onSave}
              onCancel={onCancel}
            />
          </div>
        )}
      </div>
    </div>
  )
}
