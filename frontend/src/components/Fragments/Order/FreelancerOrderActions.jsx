import { useState } from 'react'

const FreelancerOrderActions = ({ order, onAccept, onReject, onComplete, loading }) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [deliveryFiles, setDeliveryFiles] = useState([])
  const [deliveryNote, setDeliveryNote] = useState('')

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon berikan alasan penolakan')
      return
    }
    onReject(rejectReason)
    setShowRejectForm(false)
    setRejectReason('')
  }

  const handleComplete = () => {
    onComplete({
      files: deliveryFiles,
      note: deliveryNote
    })
    setShowCompleteForm(false)
  }

  // DIBAYAR - Order sudah dibayar client, freelancer bisa terima atau tolak
  if (order.status === 'dibayar') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
        <h3 className="font-semibold text-lg mb-2">Konfirmasi Order</h3>
        <p className="text-sm text-gray-600 mb-4">
          Client sudah melakukan pembayaran. Terima atau tolak order ini.
        </p>

        {!showRejectForm ? (
          <div className="flex gap-3">
            <button
              onClick={onAccept}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Terima Order'}
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Tolak Order
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alasan Penolakan *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Jelaskan alasan Anda menolak order ini..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Tolak'}
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectReason('')
                }}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // MENUNGGU PEMBAYARAN - Client belum bayar, freelancer cuma bisa tunggu
  if (order.status === 'menunggu_pembayaran') {
    return (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Menunggu Pembayaran Client</h3>
            <p className="text-sm text-yellow-800">
              Order ini masih menunggu pembayaran dari client. Anda dapat menerima atau menolak order setelah client melakukan pembayaran.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // DIKERJAKAN - Kirim hasil pekerjaan
  if (order.status === 'dikerjakan') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
        <h3 className="font-semibold text-lg mb-2">Kirim Hasil Pekerjaan</h3>
        <p className="text-sm text-gray-600 mb-4">
          Setelah selesai, kirim hasil pekerjaan Anda kepada client.
        </p>

        {!showCompleteForm ? (
          <button
            onClick={() => setShowCompleteForm(true)}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Kirim Hasil Pekerjaan
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File Hasil Pekerjaan
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setDeliveryFiles(Array.from(e.target.files))}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {deliveryFiles.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {deliveryFiles.length} file dipilih
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan untuk Client
              </label>
              <textarea
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Tambahkan catatan atau instruksi untuk client..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim & Selesaikan'}
              </button>
              <button
                onClick={() => {
                  setShowCompleteForm(false)
                  setDeliveryFiles([])
                  setDeliveryNote('')
                }}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // MENUNGGU REVIEW - Order selesai, tunggu review client
  if (order.status === 'menunggu_review') {
    return (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Menunggu Review Client</h3>
            <p className="text-sm text-blue-800">
              Hasil pekerjaan Anda telah dikirim. Menunggu client untuk mereview dan menyelesaikan order.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // SELESAI - Order completed
  if (order.status === 'selesai') {
    return (
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="font-semibold text-green-900">Order Selesai</h3>
        </div>
        <p className="text-sm text-green-800">
          Order ini telah diselesaikan. Terima kasih atas pekerjaan Anda!
        </p>
      </div>
    )
  }

  // DIBATALKAN - Order cancelled
  if (order.status === 'dibatalkan') {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="font-semibold text-red-900">Order Dibatalkan</h3>
        </div>
        <p className="text-sm text-red-800">
          Order ini telah dibatalkan.
        </p>
      </div>
    )
  }

  return null
}

export default FreelancerOrderActions
