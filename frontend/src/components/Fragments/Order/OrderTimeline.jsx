import StatusBadge from '../../Elements/Common/StatusBadge'

const OrderTimeline = ({ statusHistory = [] }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>Belum ada riwayat status</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {statusHistory.map((item, index) => (
        <div key={index} className="flex items-start relative">
          {/* Line connector */}
          {index < statusHistory.length - 1 && (
            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-300" style={{ height: '3rem' }} />
          )}
          
          {/* Icon */}
          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            index === 0 
              ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {index === 0 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-xs font-bold">{statusHistory.length - index}</span>
            )}
          </div>
          
          {/* Content */}
          <div className="ml-4 flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <StatusBadge status={item.to} />
                <p className="text-xs text-gray-500">
                  {new Date(item.changedAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              {item.from && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Status berubah dari:</span> {item.from}
                </p>
              )}
              
              {item.note && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">Catatan:</p>
                  <p>{item.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderTimeline
