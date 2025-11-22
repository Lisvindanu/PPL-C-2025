import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/organisms/Navbar'
import api from '../../utils/axiosConfig'

export default function PaymentProcessingPage() {
  const { paymentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [paymentData, setPaymentData] = useState(location.state?.paymentData || null)
  const [paymentInstructions, setPaymentInstructions] = useState(location.state?.paymentInstructions || null)
  const [orderData, setOrderData] = useState(location.state?.orderData || null)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours in seconds
  const [loading, setLoading] = useState(false)

  // Debug: Log state on mount
  useEffect(() => {
    console.log('[PaymentProcessingPage] Mounted with state:', {
      hasLocationState: !!location.state,
      paymentData,
      paymentInstructions,
      orderData,
      type: paymentInstructions?.type,
      qrString: paymentInstructions?.qr_string,
      vaNumber: paymentInstructions?.va_number,
      bank: paymentInstructions?.bank,
      fullInstructions: paymentInstructions
    })

    // Fallback: Fetch payment data from API if not in state
    if (!paymentInstructions && paymentId) {
      console.log('[PaymentProcessingPage] No instructions in state, fetching from API...')
      setLoading(true)
      api.get(`/payments/${paymentId}`)
        .then(response => {
          console.log('[PaymentProcessingPage] Fetched payment data:', response.data)
          const data = response.data.data
          setPaymentData(data)
          setPaymentInstructions(data.payment_instructions)
          setLoading(false)
        })
        .catch(error => {
          console.error('[PaymentProcessingPage] Failed to fetch payment:', error)
          setLoading(false)
        })
    }
  }, [])

  // Format rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format countdown timer
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format payment method name
  const formatPaymentMethod = () => {
    if (paymentInstructions?.channel) return paymentInstructions.channel
    if (paymentInstructions?.bank) return paymentInstructions.bank.toUpperCase()

    const typeMap = {
      'qris': 'QRIS',
      'virtual_account': 'Virtual Account',
      'transfer_bank': 'Transfer Bank',
      'bank_transfer': 'Transfer Bank',
      'e_wallet': 'E-Wallet',
      'ewallet': 'E-Wallet',
      'kartu_kredit': 'Kartu Kredit',
      'credit_card': 'Kartu Kredit'
    }

    return typeMap[paymentInstructions?.type] || paymentInstructions?.type || 'Unknown'
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to expired page
          navigate(`/payment/expired?order_id=${orderData?.order_id || paymentId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, orderData, paymentId])

  // Auto check payment status every 10 seconds
  useEffect(() => {
    let isActive = true

    const checkStatus = async () => {
      if (!isActive) return

      try {
        const transactionId = paymentData?.transaction_id || paymentId
        const response = await api.get(`/payments/check-status/${transactionId}`)
        const status = response.data.data.status

        if (!isActive) return

        const amount = paymentData?.total_bayar || orderData?.amount

        console.log('[PaymentProcessingPage] Auto-check status:', status)

        // Redirect based on status
        if (status === 'berhasil' || status === 'paid' || status === 'success' || status === 'settlement') {
          navigate(`/payment/success?order_id=${transactionId}&transaction_id=${transactionId}&gross_amount=${amount}`)
        } else if (status === 'kadaluarsa' || status === 'expired') {
          navigate(`/payment/expired?order_id=${transactionId}&transaction_id=${transactionId}&gross_amount=${amount}`)
        } else if (status === 'gagal' || status === 'failed' || status === 'deny') {
          navigate(`/payment/error?order_id=${transactionId}&gross_amount=${amount}&message=Pembayaran%20gagal`)
        }
        // Note: Don't redirect on 'menunggu'/'pending' - keep user on processing page
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }

    // Check immediately
    checkStatus()

    // Then check every 10 seconds
    const interval = setInterval(checkStatus, 10000)

    return () => {
      isActive = false
      clearInterval(interval)
    }
  }, [paymentId, paymentData?.transaction_id, paymentData?.total_bayar, orderData?.amount, navigate])

  // Manual check payment status function
  const handleManualCheckStatus = async () => {
    setLoading(true)
    try {
      const transactionId = paymentData?.transaction_id || paymentId
      const response = await api.get(`/payments/check-status/${transactionId}`)
      const { status } = response.data.data
      const amount = paymentData?.total_bayar || orderData?.amount

      console.log('[PaymentProcessingPage] Manual status check:', status)

      // Redirect based on status
      if (status === 'berhasil' || status === 'paid' || status === 'success' || status === 'settlement') {
        navigate(`/payment/success?order_id=${transactionId}&transaction_id=${transactionId}&gross_amount=${amount}`)
      } else if (status === 'menunggu' || status === 'pending') {
        navigate(`/payment/pending?order_id=${transactionId}&gross_amount=${amount}`)
      } else if (status === 'kadaluarsa' || status === 'expired') {
        navigate(`/payment/expired?order_id=${transactionId}&transaction_id=${transactionId}&gross_amount=${amount}`)
      } else if (status === 'gagal' || status === 'failed' || status === 'deny') {
        navigate(`/payment/error?order_id=${transactionId}&gross_amount=${amount}&message=Pembayaran%20gagal`)
      } else {
        // Status masih processing, show alert
        alert('Status pembayaran masih diproses. Halaman akan di-refresh.')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      alert('Gagal memeriksa status pembayaran. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Berhasil disalin ke clipboard!')
  }

  if (!paymentInstructions || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment instructions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with countdown */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menunggu Pembayaran</h1>
              <p className="text-gray-600 mt-1">Selesaikan pembayaran sebelum waktu habis</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Waktu tersisa</p>
              <p className="text-3xl font-bold text-red-600">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instruksi Pembayaran</h2>

          {/* QRIS */}
          {paymentInstructions.type === 'qris' && paymentInstructions.qr_string && (
            <div className="text-center">
              <p className="text-gray-700 mb-4">Scan QR code di bawah ini dengan aplikasi e-wallet atau mobile banking Anda</p>

              {/* QR Code from Midtrans */}
              <div className="inline-block bg-white p-4 border-4 border-gray-300 rounded-lg mb-4">
                {paymentInstructions.qr_string.startsWith('http') ? (
                  <img
                    src={paymentInstructions.qr_string}
                    alt="QR Code QRIS"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      console.error('QR Code image failed to load:', paymentInstructions.qr_string)
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center px-4">
                      <p className="text-sm text-gray-600 mb-2">QR Code Data</p>
                      <p className="text-xs font-mono text-gray-700 break-all">
                        {paymentInstructions.qr_string.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => copyToClipboard(paymentInstructions.qr_string)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salin QR String
                </button>
              </div>
            </div>
          )}

          {/* Bank Transfer - Virtual Account */}
          {(paymentInstructions.type === 'bank_transfer' || paymentInstructions.type === 'virtual_account' || paymentInstructions.type === 'transfer_bank') && paymentInstructions.va_number && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  Transfer ke Virtual Account {paymentInstructions.bank?.toUpperCase() || 'Bank'}
                </p>
                <div className="flex items-center justify-between bg-white rounded px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                    <p className="text-2xl font-mono font-bold text-gray-900">
                      {paymentInstructions.va_number}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentInstructions.va_number)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cara Pembayaran:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Buka aplikasi mobile banking atau ATM {paymentInstructions.bank?.toUpperCase()}</li>
                  <li>Pilih menu Transfer / Transfer ke Virtual Account</li>
                  <li>Masukkan nomor Virtual Account: <span className="font-mono font-semibold">{paymentInstructions.va_number}</span></li>
                  <li>Masukkan nominal: <span className="font-semibold">{formatRupiah(paymentData?.total_bayar || orderData?.amount)}</span></li>
                  <li>Konfirmasi dan selesaikan pembayaran</li>
                  <li>Simpan bukti transfer Anda</li>
                </ol>
              </div>
            </div>
          )}

          {/* E-Wallet */}
          {(paymentInstructions.type === 'ewallet' || paymentInstructions.type === 'e_wallet') && paymentInstructions.actions && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-900 font-medium mb-3">
                  Bayar dengan {paymentInstructions.channel?.toUpperCase() || 'E-Wallet'}
                </p>

                {paymentInstructions.actions.map((action, index) => (
                  <div key={index} className="mb-3">
                    {action.name === 'deeplink-redirect' && action.url && (
                      <a
                        href={action.url}
                        className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                      >
                        Buka Aplikasi {paymentInstructions.channel?.toUpperCase()}
                      </a>
                    )}
                    {action.name === 'generate-qr-code' && action.url && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Atau scan QR code:</p>
                        <div className="inline-block bg-white p-4 border-2 border-gray-200 rounded-lg">
                          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                            <p className="text-xs text-gray-500">QR Code</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cara Pembayaran:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Klik tombol "Buka Aplikasi {paymentInstructions.channel?.toUpperCase()}"</li>
                  <li>Anda akan diarahkan ke aplikasi {paymentInstructions.channel?.toUpperCase()}</li>
                  <li>Konfirmasi pembayaran sebesar <span className="font-semibold">{formatRupiah(paymentData?.total_bayar || orderData?.amount)}</span></li>
                  <li>Selesaikan transaksi</li>
                  <li>Anda akan otomatis kembali ke halaman ini setelah pembayaran berhasil</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Pembayaran</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium text-gray-900">{paymentData?.transaction_id || orderData?.order_id || paymentId}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="font-medium text-gray-900">
                {formatPaymentMethod()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Menunggu Pembayaran
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total Pembayaran</span>
                <span className="font-bold text-xl text-[#4782BE]">
                  {formatRupiah(paymentData?.total_bayar || orderData?.amount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Check Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-1">Pemeriksaan Status Otomatis</p>
              <p className="text-blue-700">
                Sistem akan otomatis memeriksa status pembayaran Anda. Setelah pembayaran berhasil, Anda akan diarahkan ke halaman konfirmasi.
              </p>
            </div>
          </div>
        </div>

        {/* Manual Check Button */}
        <div className="text-center">
          <button
            onClick={handleManualCheckStatus}
            disabled={loading}
            className="px-6 py-3 bg-[#4782BE] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memeriksa...' : 'Cek Status Pembayaran'}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Butuh bantuan? <a href="#" className="text-[#4782BE] hover:underline">Hubungi Customer Service</a>
          </p>
        </div>
      </div>
    </div>
  )
}
