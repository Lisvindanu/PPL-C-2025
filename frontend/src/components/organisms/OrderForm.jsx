import React, { useState } from 'react'
import { X, Paperclip } from 'lucide-react'

const OrderForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    requirements: '',
    attachments: [],
    specialInstructions: '',
    budget: service.price,
    timeline: '1 week'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const orderData = {
        serviceId: service.id,
        serviceTitle: service.title,
        freelancerId: service.freelancer.id,
        freelancerName: service.freelancer.name,
        requirements: formData.requirements,
        attachments: formData.attachments,
        specialInstructions: formData.specialInstructions,
        budget: formData.budget,
        timeline: formData.timeline,
        status: 'pending'
      }
      
      onSubmit(orderData)
    } catch (error) {
      console.error('Error submitting order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-primaryLight px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text">Buat Pesanan</h3>
              <p className="text-sm text-textMuted">Lengkapi detail pesanan Anda</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-textMuted" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={service.thumbnail}
              alt={service.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-text">{service.title}</h4>
              <p className="text-sm text-textMuted">oleh {service.freelancer.name}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-textMuted">
                  Rating: {service.freelancer.rating} ({service.freelancer.reviews} reviews)
                </span>
                <span className="text-lg font-bold text-primary">
                  ${service.price}/{service.period}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Detail Kebutuhan *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Jelaskan kebutuhan proyek Anda secara detail..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Timeline Pengerjaan
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="1 week">1 Minggu</option>
                <option value="2 weeks">2 Minggu</option>
                <option value="1 month">1 Bulan</option>
                <option value="2 months">2 Bulan</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Budget (USD)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min={service.price}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Lampiran File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Paperclip className="w-8 h-8 text-textMuted mb-2" />
                <span className="text-sm text-textMuted">
                  Klik untuk upload file atau drag & drop
                </span>
                <span className="text-xs text-textMuted mt-1">
                  PDF, DOC, JPG, PNG (Max 10MB)
                </span>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm text-text truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-error hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Instruksi Khusus
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Instruksi khusus atau catatan tambahan..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.requirements}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primaryDark disabled:bg-disabled disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderForm
