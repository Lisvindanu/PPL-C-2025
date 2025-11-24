import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/organisms/Navbar'
import Button from '../../components/atoms/Button'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: searchParams.get('order_id') || '-',
    transactionId: searchParams.get('transaction_id') || '-',
    amount: searchParams.get('gross_amount') || '0'
  })

  useEffect(() => {
    // Optional: Verify payment status with backend
    // You can add API call here to verify the payment
  }, [])

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleOrders = () => {
    // Navigate to orders page when it's available
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pembayaran Berhasil!
          </h1>

          <p className="text-gray-600 mb-8">
            Terima kasih! Pembayaran Anda telah berhasil diproses.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Detail Pembayaran</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">{paymentInfo.orderId}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium text-gray-900">{paymentInfo.transactionId}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="font-bold text-lg text-[#4782BE]">
                  Rp {parseInt(paymentInfo.amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Pembayaran Dikonfirmasi</span>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Langkah Selanjutnya</p>
                <p className="text-blue-700">
                  Dana Anda telah masuk ke escrow dan akan diteruskan ke freelancer setelah pekerjaan selesai.
                  Anda dapat memantau progress order di halaman dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleOrders}
              className="w-full sm:w-auto"
            >
              Lihat Pesanan Saya
            </Button>
            <Button
              variant="outline"
              onClick={handleDashboard}
              className="w-full sm:w-auto"
            >
              Kembali ke Dashboard
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-8">
            Invoice dan detail pembayaran telah dikirim ke email Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
