import StatusBadge from '../atoms/StatusBadge'
import PriceText from '../atoms/PriceText'

const OrderCard = ({ order, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-6"
      onClick={() => onClick(order.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.judul}</h3>
          <p className="text-sm text-gray-600">Order #{order.nomor_pesanan}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
        {order.freelancer && (
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Freelancer: {order.freelancer.nama_depan} {order.freelancer.nama_belakang}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-700">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Waktu pengerjaan: {order.waktu_pengerjaan} hari</span>
        </div>

        {order.tenggat_waktu && (
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Deadline: {new Date(order.tenggat_waktu).toLocaleDateString('id-ID')}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Pembayaran</p>
          <PriceText amount={order.total_bayar} size="lg" />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
