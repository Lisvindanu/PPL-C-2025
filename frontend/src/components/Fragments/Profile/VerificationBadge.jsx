import Icon from '../../Elements/Icons/Icon'

export default function VerificationBadge({ 
  type, 
  isVerified = false 
}) {
  const labels = {
    id: 'ID',
    phone: 'Nomor HP'
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600">{labels[type]}:</span>
      <span className={`font-medium ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
        {isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
      </span>
      {isVerified && <Icon name="check" size="sm" className="text-green-600" />}
    </div>
  )
}
