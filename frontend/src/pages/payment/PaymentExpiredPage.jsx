import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/organisms/Navbar'
import Button from '../../components/atoms/Button'

export default function PaymentExpiredPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: searchParams.get('order_id') || '-',
    transactionId: searchParams.get('transaction_id') || '-',
    amount: searchParams.get('gross_amount') || '0'
  })

  const handleRetryPayment = () => {
    // Navigate back to payment page or order page to retry
    navigate('/dashboard')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleSupport = () => {
    // Navigate to support page or open support contact
    window.location.href = 'mailto:support@skillconnect.com?subject=Payment%20Expired%20-%20' + paymentInfo.orderId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
          {/* Expired Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pembayaran Kadaluarsa
          </h1>

          <p className="text-gray-600 mb-8">
            Waktu pembayaran telah habis. Silakan buat pembayaran baru untuk melanjutkan pesanan Anda.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Detail Pembayaran</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">{paymentInfo.orderId}</span>
              </div>

              {paymentInfo.transactionId !== '-' && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-gray-900">{paymentInfo.transactionId}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="font-bold text-lg text-[#4782BE]">
                  Rp {parseInt(paymentInfo.amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium">Pembayaran Kadaluarsa</span>
          </div>

          {/* Expiry Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-orange-900 font-medium mb-2">Mengapa Pembayaran Kadaluarsa?</p>
                <ul className="text-orange-800 space-y-1 list-disc list-inside">
                  <li>Batas waktu pembayaran adalah 24 jam sejak transaksi dibuat</li>
                  <li>Pembayaran tidak diselesaikan dalam waktu yang ditentukan</li>
                  <li>Transaksi otomatis dibatalkan untuk keamanan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What to do next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-2">Langkah Selanjutnya</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Buat pembayaran baru untuk pesanan yang sama</li>
                  <li>Pastikan menyelesaikan pembayaran dalam waktu 24 jam</li>
                  <li>Gunakan metode pembayaran yang mudah Anda akses</li>
                  <li>Simpan informasi pembayaran untuk referensi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Catatan:</span> Tidak ada dana yang terdebet dari akun Anda.
                  Pesanan Anda masih tersimpan dan Anda dapat membuat pembayaran baru kapan saja.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleRetryPayment}
              className="w-full sm:w-auto"
            >
              Bayar Sekarang
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
            Butuh bantuan? <a href="mailto:support@skillconnect.com" className="text-[#4782BE] hover:underline">Hubungi Customer Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
