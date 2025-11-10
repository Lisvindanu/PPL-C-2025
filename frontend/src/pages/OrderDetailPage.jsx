import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/organisms/Navbar'
import StatusBadge from '../components/atoms/StatusBadge'
import PriceText from '../components/atoms/PriceText'
import OrderTimeline from '../components/molecules/OrderTimeline'
import FreelancerOrderActions from '../components/organisms/FreelancerOrderActions'
import { getOrderById } from '../mocks/orderMockData'

/**
 * OrderDetailPage using mock data
 * This version uses static mock data instead of API calls
 */
const OrderDetailPageWithMock = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock current user (toggle between client and freelancer for testing)
  const mockCurrentUser = {
    id: 'user-freelancer-001', // Change to 'user-client-001' to test client view
    role: 'freelancer' // Change to 'client' to test client view
  }

  // Get order from mock data
  const order = getOrderById(id)

  // Mock handlers
  const handleAccept = () => {
    alert('Order accepted! (Demo mode - no actual API call)')
  }

  const handleReject = (reason) => {
    alert(`Order rejected with reason: ${reason} (Demo mode - no actual API call)`)
  }

  const handleComplete = (data) => {
    alert(`Order completed! Files: ${data.files.length}, Note: ${data.note} (Demo mode - no actual API call)`)
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Order dengan ID "{id}" tidak ditemukan dalam mock data.</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    )
  }

  const isFreelancer = mockCurrentUser?.id === order.freelancer_id
  const isClient = mockCurrentUser?.id === order.client_id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Pesanan
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Col span 2 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order header */}
            <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{order.judul}</h1>
                  <p className="text-gray-600">Order #{order.nomor_pesanan}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Harga Layanan</p>
                  <PriceText amount={order.harga} size="md" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Biaya Platform</p>
                  <PriceText amount={order.biaya_platform} size="md" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bayar</p>
                  <PriceText amount={order.total_bayar} size="lg" className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Waktu Pengerjaan</p>
                  <p className="font-semibold text-gray-900">{order.waktu_pengerjaan} hari</p>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h2>
              
              {order.deskripsi && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Deskripsi</h3>
                  <p className="text-gray-900">{order.deskripsi}</p>
                </div>
              )}

              {order.catatan_client && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Catatan Client</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{order.catatan_client}</p>
                  </div>
                </div>
              )}

              {order.lampiran_client && order.lampiran_client.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Lampiran Client</h3>
                  <div className="space-y-2">
                    {order.lampiran_client.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium">{file.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({file.size})</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {order.lampiran_freelancer && order.lampiran_freelancer.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Hasil Pekerjaan Freelancer</h3>
                  <div className="space-y-2">
                    {order.lampiran_freelancer.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium">{file.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({file.size})</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {order.tenggat_waktu && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tenggat Waktu</h3>
                  <p className="text-gray-900 font-medium">
                    {new Date(order.tenggat_waktu).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Riwayat Status</h2>
              <OrderTimeline statusHistory={order.statusHistory || []} />
            </div>
          </div>

          {/* Sidebar - Col span 1 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client info */}
            {order.client && (
              <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Client</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-4">
                    {order.client.nama_depan?.charAt(0)}{order.client.nama_belakang?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.client.nama_depan} {order.client.nama_belakang}</p>
                    <p className="text-sm text-gray-600">{order.client.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Freelancer info */}
            {order.freelancer && (
              <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Freelancer</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold mr-4">
                    {order.freelancer.nama_depan?.charAt(0)}{order.freelancer.nama_belakang?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.freelancer.nama_depan} {order.freelancer.nama_belakang}</p>
                    <p className="text-sm text-gray-600">{order.freelancer.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Freelancer actions */}
            {isFreelancer && (
              <FreelancerOrderActions
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
                loading={false}
              />
            )}

            {/* Client actions */}
            {isClient && order.status === 'menunggu_pembayaran' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 className="font-semibold text-lg mb-2">Pembayaran</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Silakan lakukan pembayaran untuk memproses pesanan Anda.
                </p>
                <button
                  onClick={() => navigate(`/payment/${order.id}?amount=${order.total_bayar}&description=${encodeURIComponent(order.judul)}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPageWithMock
