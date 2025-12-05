import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Fragments/Common/Navbar'
import Button from '../../components/Elements/Buttons/Button'

export default function PaymentErrorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: searchParams.get('order_id') || '-',
    transactionId: searchParams.get('transaction_id') || '-',
    amount: searchParams.get('gross_amount') || '0',
    errorMessage: searchParams.get('message') || 'Terjadi kesalahan saat memproses pembayaran'
  })

  const handleRetryPayment = () => {
    // Navigate back to payment page or order page to retry
    // You can implement logic to redirect to payment with the same order
    navigate('/dashboard')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleSupport = () => {
    // Navigate to support page or open support contact
    window.location.href = 'mailto:support@skillconnect.com?subject=Payment%20Error%20-%20' + paymentInfo.orderId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pembayaran Gagal
          </h1>

          <p className="text-gray-600 mb-8">
            Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau hubungi customer support.
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
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Pembayaran Gagal</span>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-red-900 font-medium mb-1">Alasan Kegagalan</p>
                <p className="text-red-700">{paymentInfo.errorMessage}</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-2">Kemungkinan Penyebab</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Saldo atau limit kartu/akun tidak mencukupi</li>
                  <li>Informasi pembayaran tidak valid</li>
                  <li>Koneksi internet terputus saat transaksi</li>
                  <li>Pembayaran ditolak oleh bank/payment gateway</li>
                  <li>Transaksi melebihi batas waktu</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What to do next */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-yellow-900 font-medium mb-2">Langkah Selanjutnya</p>
                <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Periksa kembali saldo atau limit pembayaran Anda</li>
                  <li>Coba gunakan metode pembayaran yang berbeda</li>
                  <li>Pastikan koneksi internet stabil</li>
                  <li>Hubungi bank/penyedia pembayaran Anda</li>
                  <li>Atau hubungi customer support kami untuk bantuan</li>
                </ul>
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
              Coba Lagi
            </Button>
            <Button
              variant="outline"
              onClick={handleSupport}
              className="w-full sm:w-auto"
            >
              Hubungi Support
            </Button>
            <Button
              variant="neutral"
              onClick={handleDashboard}
              className="w-full sm:w-auto"
            >
              Kembali ke Dashboard
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-8">
            Order ID: {paymentInfo.orderId} • Butuh bantuan? Email: support@skillconnect.com
          </p>
        </div>
      </div>
    </div>
  )
}
