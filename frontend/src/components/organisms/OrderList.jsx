import React from 'react'
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const OrderList = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'in_progress':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi'
      case 'accepted':
        return 'Diterima'
      case 'rejected':
        return 'Ditolak'
      case 'in_progress':
        return 'Sedang Dikerjakan'
      case 'completed':
        return 'Selesai'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Clock className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-text mb-2">Belum Ada Pesanan</h3>
        <p className="text-textMuted mb-6">Mulai pesan layanan untuk melihat daftar pesanan Anda</p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors">
          Jelajahi Layanan
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm font-medium text-textMuted">#{order.id}</span>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text mb-1">{order.service}</h3>
                <p className="text-sm text-textMuted">Freelancer: {order.freelancer}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-textMuted">Harga</span>
                  <p className="font-semibold text-text">${order.price}</p>
                </div>
                <div>
                  <span className="text-sm text-textMuted">Dibuat</span>
                  <p className="font-semibold text-text">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-sm text-textMuted">Deadline</span>
                  <p className="font-semibold text-text">{new Date(order.deadline).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-textMuted mb-2">
                  <span>Progress</span>
                  <span>
                    {order.status === 'pending' && '0%'}
                    {order.status === 'accepted' && '25%'}
                    {order.status === 'in_progress' && '75%'}
                    {order.status === 'completed' && '100%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      order.status === 'pending' ? 'w-0 bg-gray-400' :
                      order.status === 'accepted' ? 'w-1/4 bg-yellow-500' :
                      order.status === 'in_progress' ? 'w-3/4 bg-blue-500' :
                      order.status === 'completed' ? 'w-full bg-green-500' :
                      'w-0 bg-gray-400'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              {order.status === 'pending' && (
                <button className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Batalkan
                </button>
              )}
              
              {order.status === 'accepted' && (
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors">
                  Mulai Chat
                </button>
              )}
              
              {order.status === 'in_progress' && (
                <div className="space-y-2">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors">
                    Lihat Progress
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-text rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Chat
                  </button>
                </div>
              )}
              
              {order.status === 'completed' && (
                <div className="space-y-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Beri Review
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-text rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Download
                  </button>
                </div>
              )}

              <button className="px-4 py-2 border border-gray-300 text-text rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Detail
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderList
