import { useState } from 'react'
import OrderCard from '../molecules/OrderCard'

const OrderList = ({ orders = [], onOrderClick, loading }) => {
  const [filter, setFilter] = useState('all')

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const filterOptions = [
    { value: 'all', label: 'Semua', count: orders.length },
    { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran', count: orders.filter(o => o.status === 'menunggu_pembayaran').length },
    { value: 'dibayar', label: 'Dibayar', count: orders.filter(o => o.status === 'dibayar').length },
    { value: 'dikerjakan', label: 'Dikerjakan', count: orders.filter(o => o.status === 'dikerjakan').length },
    { value: 'selesai', label: 'Selesai', count: orders.filter(o => o.status === 'selesai').length },
    { value: 'dibatalkan', label: 'Dibatalkan', count: orders.filter(o => o.status === 'dibatalkan').length }
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map(option => (
          <button
            key={option.value}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filter === option.value 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
            {option.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === option.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat pesanan...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">Tidak ada pesanan</p>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Anda belum memiliki pesanan' 
              : `Tidak ada pesanan dengan status "${filterOptions.find(o => o.value === filter)?.label}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={onOrderClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderList
