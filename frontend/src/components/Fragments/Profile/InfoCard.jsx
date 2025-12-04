import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'
import TextField from '../atoms/TextField'

export default function InfoCard({ 
  profile, 
  isEditing, 
  onProfileChange 
}) {
  const handleNameChange = (e) => {
    const names = e.target.value.split(' ')
    onProfileChange({
      nama_depan: names[0] || '',
      nama_belakang: names.slice(1).join(' ') || ''
    })
  }

  const handleLocationChange = (e) => {
    const location = e.target.value.split(', ')
    onProfileChange({
      kota: location[0] || '',
      provinsi: location[1] || ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
            size="lg"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600">
              <Icon name="camera" size="sm" />
            </button>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <TextField 
                value={`${profile.nama_depan} ${profile.nama_belakang}`}
                onChange={handleNameChange}
                className="text-2xl font-semibold text-gray-900 flex-1"
                variant="default"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-900">
                {profile.nama_depan} {profile.nama_belakang}
              </h2>
            )}
            {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {isEditing ? (
              <TextField 
                value={`${profile.kota}, ${profile.provinsi}`}
                onChange={handleLocationChange}
                className="text-gray-600 flex-1"
                variant="default"
              />
            ) : (
              <p className="text-gray-600">{profile.kota}, {profile.provinsi}</p>
            )}
            {isEditing && <Icon name="edit" size="sm" className="text-gray-400" />}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Icon name="share" />
            </button>
            <Button variant="neutral">
              {isEditing ? 'Simpan' : 'Sewa'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
