import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'
import { orderService } from '../services/orderService'
import { formatRupiah } from '../utils/format'

const CreateOrderPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { service } = location.state || {}

  const [formData, setFormData] = useState({
    catatan_client: ''
  })

  const [attachments, setAttachments] = useState([])
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Normalized price & totals
  const basePrice = Number(service?.price) || 0
  const platformFee = basePrice * 0.1
  const totalPayment = basePrice + platformFee

  // Validation logic
  const isFormValid = useMemo(() => {
    return service && service.id
  }, [service])

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Data layanan tidak ditemukan</h2>
          <button
            onClick={() => navigate('/services')}
            className="text-[#4782BE] hover:underline"
          >
            Kembali ke daftar layanan
          </button>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent submission if form is invalid
    if (!isFormValid || loading) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Call API to create order
      const response = await orderService.createOrder({
        serviceId: service.id,
        paketId: service.paket_id || null,
        catatanClient: formData.catatan_client
      })

      if (response.success && response.data) {
        const order = response.data
        // Redirect ke halaman pembayaran
        navigate(`/payment/${order.id}?amount=${order.total_bayar}&description=${encodeURIComponent(order.judul)}`)
      } else {
        setError(response.message || 'Gagal membuat order')
        setLoading(false)
      }
    } catch (err) {
      setError('Terjadi kesalahan saat membuat order')
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1D375B] hover:text-[#4782BE] flex items-center gap-2 mb-4 font-medium transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Kembali
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Buat Pesanan Baru</h1>
            <p className="text-neutral-700">Lengkapi informasi pesanan Anda untuk memulai kolaborasi</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-briefcase text-[#4782BE]"></i>
                  Informasi Layanan
                </h2>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] rounded-xl">
                  <img
                    src="/asset/layanan/Layanan.png"
                    alt={service.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 mb-2">{service.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]"></div>
                      <p className="text-sm text-neutral-700 font-medium">{service.freelancer}</p>
                    </div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-white rounded-full text-[#1D375B]">
                      {service.category}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-file-alt text-[#4782BE]"></i>
                  Detail Pesanan
                </h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Info layanan akan otomatis dari service yang dipilih */}
                  <div className="p-4 bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] rounded-xl">
                    <p className="text-sm text-neutral-700 mb-2">
                      <i className="fas fa-info-circle text-[#4782BE] mr-2"></i>
                      Order akan dibuat berdasarkan layanan yang Anda pilih
                    </p>
                    <p className="text-xs text-neutral-600">
                      Judul dan deskripsi akan diambil dari layanan: <span className="font-semibold">{service?.title}</span>
                    </p>
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Catatan Tambahan
                    </label>
                    <textarea
                      name="catatan_client"
                      value={formData.catatan_client}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-[#D8E3F3] rounded-xl focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE] transition-all"
                      placeholder="Catatan khusus atau preferensi..."
                    />
                  </div>

                  {/* Lampiran */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Lampiran File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        className="w-full px-4 py-3 border-2 border-dashed border-[#D8E3F3] rounded-xl focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#4782BE] file:to-[#1D375B] file:text-white hover:file:opacity-90"
                      />
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 flex items-start gap-1">
                      <i className="fas fa-paperclip text-[#4782BE] mt-0.5"></i>
                      Upload file pendukung seperti brand guideline, referensi, dll.
                    </p>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-[#D8E3F3] to-[#9DBBDD] rounded-lg"
                          >
                            <span className="text-sm text-neutral-900 truncate flex-1 font-medium flex items-center gap-2">
                              <i className="fas fa-file text-[#4782BE]"></i>
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700 ml-2 transition-colors"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-4"
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <i className="fas fa-receipt text-[#4782BE]"></i>
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <i className="fas fa-tag text-[#4782BE] text-xs"></i>
                    Harga layanan
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatRupiah(basePrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <i className="fas fa-percentage text-[#4782BE] text-xs"></i>
                    Biaya platform (10%)
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatRupiah(platformFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <i className="fas fa-clock text-[#4782BE] text-xs"></i>
                    Waktu pengerjaan
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {service?.duration || 7} hari
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <i className="fas fa-sync-alt text-[#4782BE] text-xs"></i>
                    Batas revisi
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {service?.revisions === 99 ? 'Unlimited' : `${service?.revisions || 3}x`}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-[#D8E3F3]">
                <div className="flex justify-between mb-6">
                  <span className="font-bold text-neutral-900 text-lg">Total Pembayaran</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
                    {formatRupiah(totalPayment)}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || loading}
                  className={`w-full py-4 rounded-xl transition-all duration-300 font-bold text-lg ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Membuat Pesanan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Buat Pesanan
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <i className="fas fa-shield-alt text-[#4782BE]"></i>
                    <span>Pembayaran dilindungi platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <i className="fas fa-headset text-[#4782BE]"></i>
                    <span>Dukungan customer service 24/7</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  Dengan membuat pesanan, Anda menyetujui{' '}
                  <a href="#" className="text-[#4782BE] hover:underline font-semibold">
                    syarat dan ketentuan
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CreateOrderPage
