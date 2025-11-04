import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/organisms/Navbar'
import Button from '../../components/atoms/Button'

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: searchParams.get('order_id') || '-',
    transactionId: searchParams.get('transaction_id') || '-',
    amount: searchParams.get('gross_amount') || '0'
  })

  useEffect(() => {
    // Optional: Poll payment status from backend
    // You can add API call here to check payment status periodically
  }, [])

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleCheckStatus = () => {
    // Implement check payment status
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
          {/* Pending Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pembayaran Menunggu Konfirmasi
          </h1>

          <p className="text-gray-600 mb-8">
            Pembayaran Anda sedang dalam proses. Mohon tunggu konfirmasi dari sistem pembayaran.
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
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Menunggu Pembayaran</span>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm">
                <p className="text-yellow-900 font-medium mb-2">Instruksi Pembayaran</p>
                <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Selesaikan pembayaran sesuai metode yang dipilih</li>
                  <li>Untuk transfer bank, lakukan transfer sesuai nominal yang tertera</li>
                  <li>Untuk QRIS/e-wallet, selesaikan pembayaran di aplikasi Anda</li>
                  <li>Konfirmasi otomatis akan dikirim setelah pembayaran terverifikasi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Catatan Penting</p>
                <p className="text-blue-700">
                  Halaman ini dapat Anda tutup. Notifikasi akan dikirim ke email Anda setelah pembayaran berhasil dikonfirmasi.
                  Pembayaran akan otomatis dibatalkan jika tidak diselesaikan dalam 24 jam.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleCheckStatus}
              className="w-full sm:w-auto"
            >
              Cek Status Pembayaran
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
            Mengalami kendala? Hubungi customer support kami.
          </p>
        </div>
      </div>
    </div>
  )
}
