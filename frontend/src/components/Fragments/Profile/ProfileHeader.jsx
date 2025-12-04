import { Link } from 'react-router-dom'
import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'

export default function ProfileHeader({ 
  profile, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onLogout,
  loading = false 
}) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Profile' : 'Profile'}
        </h1>
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" size="sm" />
            <span className="font-semibold text-gray-900">Skill Connect</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Icon name="camera" />
                </button>
                <Button variant="neutral" onClick={onSave} disabled={loading}>
                  Simpan
                </Button>
              </>
            ) : (
              <button 
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Icon name="edit" />
              </button>
            )}
            
            <Button variant="outline" onClick={onLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
