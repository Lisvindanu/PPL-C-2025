import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Fragments/Common/Navbar'
import Footer from '../../components/Fragments/Common/Footer'
import OrderList from '../../components/Fragments/Order/OrderList'
import { useOrders } from '../../hooks/useOrder'

/**
 * OrderListPage - My Orders
 * Client dapat melihat semua order mereka
 */
const OrderListPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState(null)

  // Ambil orders dari backend: GET /api/orders/my via hook useOrders
  const { orders = [], pagination = { page: 1, limit: 10, total: 0, totalPages: 1 }, isLoading, error } = useOrders({
    page,
    limit: 10,
    status: statusFilter,
  })

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  // Count orders by status (berdasarkan data yang sudah difetch)
  const countByStatus = (status) => {
    return orders.filter(o => o.status === status).length
  }

  // Total pesanan (fallback ke panjang array kalau belum ada pagination.total)
  const totalOrders = pagination && typeof pagination.total === 'number'
    ? pagination.total
    : orders.length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
            <p className="text-gray-600">
              Kelola dan lacak semua pesanan Anda di sini
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dikerjakan</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {countByStatus('dikerjakan')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">
                    {countByStatus('selesai')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {countByStatus('menunggu_pembayaran')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error.message || error}
            </p>
          </div>
        )}

        {/* Order List */}
        <OrderList
          orders={orders}
          onOrderClick={handleOrderClick}
          loading={isLoading}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow p-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded-full border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <div className="text-sm text-gray-700">
              Halaman {pagination.page} dari {pagination.totalPages} | Total {pagination.total} pesanan
            </div>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => (pagination ? Math.min(pagination.totalPages, prev + 1) : prev + 1))}
              className="px-3 py-1 rounded-full border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default OrderListPage
