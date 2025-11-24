import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faUniversity, faWallet, faMobileAlt } from '@fortawesome/free-solid-svg-icons'
import { faCcVisa } from '@fortawesome/free-brands-svg-icons'
import Navbar from '../../components/organisms/Navbar'
import Button from '../../components/atoms/Button'
import api from '../../utils/axiosConfig'

export default function PaymentGatewayPage() {
  const [searchParams] = useSearchParams()
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [selectedMethod, setSelectedMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderData, setOrderData] = useState(null)

  // Payment methods
  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      icon: faQrcode,
      iconColor: 'text-red-500',
      type: 'qris',
      channel: null,
      description: 'Scan QR code dengan aplikasi e-wallet atau mobile banking'
    },
    {
      id: 'bca',
      name: 'Bank Transfer - BCA',
      icon: faUniversity,
      iconColor: 'text-blue-600',
      type: 'virtual_account',
      channel: 'BCA',
      description: 'Transfer melalui Virtual Account BCA'
    },
    {
      id: 'mandiri',
      name: 'Bank Transfer - Mandiri',
      icon: faUniversity,
      iconColor: 'text-yellow-600',
      type: 'virtual_account',
      channel: 'Mandiri',
      description: 'Transfer melalui Virtual Account Mandiri'
    },
    {
      id: 'bni',
      name: 'Bank Transfer - BNI',
      icon: faUniversity,
      iconColor: 'text-orange-600',
      type: 'virtual_account',
      channel: 'BNI',
      description: 'Transfer melalui Virtual Account BNI'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      icon: faWallet,
      iconColor: 'text-green-500',
      type: 'e_wallet',
      channel: 'GoPay',
      description: 'Bayar dengan GoPay'
    },
    {
      id: 'ovo',
      name: 'OVO',
      icon: faWallet,
      iconColor: 'text-purple-600',
      type: 'e_wallet',
      channel: 'OVO',
      description: 'Bayar dengan OVO'
    },
    {
      id: 'dana',
      name: 'DANA',
      icon: faMobileAlt,
      iconColor: 'text-blue-500',
      type: 'e_wallet',
      channel: 'DANA',
      description: 'Bayar dengan DANA'
    }
  ]

  useEffect(() => {
    // Get order data from URL params
    const amount = searchParams.get('amount') || '0'
    const order_id = orderId || searchParams.get('order_id') || '-'
    const description = searchParams.get('description') || 'Pembayaran Order NobarWithUs'

    setOrderData({
      order_id: order_id,
      amount: parseInt(amount),
      description: description
    })
  }, [searchParams, orderId])

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Pilih metode pembayaran terlebih dahulu')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')

      // Find selected payment method details
      const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedMethod)

      if (!selectedPaymentMethod) {
        throw new Error('Payment method not found')
      }

      // Call backend API to create payment using axios
      const response = await api.post('/payments/create', {
        pesanan_id: orderData.order_id,
        jumlah: orderData.amount,
        metode_pembayaran: selectedPaymentMethod.type,
        channel: selectedPaymentMethod.channel,
        customer_email: userData.email || 'customer@example.com',
        customer_name: userData.nama || 'Customer',
        order_title: orderData.description
      })

      // Get payment instructions from response
      const paymentInstructions = response.data.data.payment_instructions

      console.log('[PaymentGatewayPage] Navigating with data:', {
        paymentInstructions,
        paymentData: response.data.data,
        orderData,
        qrString: paymentInstructions?.qr_string
      })

      if (paymentInstructions) {
        // Navigate to payment processing page with instructions
        navigate(`/payment/processing/${response.data.data.payment_id}`, {
          state: {
            paymentInstructions,
            paymentData: response.data.data,
            orderData
          }
        })
      } else {
        throw new Error('Payment instructions tidak ditemukan')
      }

    } catch (err) {
      console.error('Payment error:', err)
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat memproses pembayaran')
      setLoading(false)
    }
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Pilih Metode Pembayaran</h1>
          <p className="text-gray-600 mt-2">Pilih metode pembayaran yang Anda inginkan</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-red-900 font-medium">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={loading}
                    className={'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ' + (
                      selectedMethod === method.id
                        ? 'border-[#4782BE] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ) + (loading ? ' opacity-50 cursor-not-allowed' : '')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center ${method.iconColor}`}>
                        <FontAwesomeIcon icon={method.icon} className="text-3xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <svg className="w-6 h-6 text-[#4782BE]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="text-blue-900 font-medium mb-1">Informasi Pembayaran</p>
                    <p className="text-blue-700">
                      Dana Anda akan disimpan di sistem escrow kami dan akan diteruskan ke freelancer setelah pekerjaan selesai dan Anda approve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium text-gray-900">{orderData.order_id}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deskripsi</span>
                  <span className="font-medium text-gray-900 text-right max-w-[180px] truncate">
                    {orderData.description}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Pembayaran</span>
                    <span className="font-bold text-xl text-[#4782BE]">
                      Rp {orderData.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={!selectedMethod || loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Bayar Sekarang'
                )}
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-[#4782BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-[#4782BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Dilindungi sistem escrow</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Cara Pembayaran</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Pilih metode pembayaran yang Anda inginkan</li>
            <li>Klik tombol "Bayar Sekarang"</li>
            <li>Anda akan diarahkan ke halaman pembayaran Midtrans</li>
            <li>Ikuti instruksi pembayaran yang muncul (QR code untuk QRIS, nomor VA untuk transfer bank, dll.)</li>
            <li>Selesaikan pembayaran sebelum batas waktu</li>
            <li>Dana akan otomatis tersimpan di escrow setelah pembayaran berhasil</li>
            <li>Anda akan diarahkan kembali ke halaman konfirmasi</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
