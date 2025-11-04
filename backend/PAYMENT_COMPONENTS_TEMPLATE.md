# Payment Frontend Component Examples & Templates

This document provides code templates for creating payment-related components following the project's exact architecture patterns.

---

## 1. PAYMENT SERVICE (Service Layer)

**File**: `/src/services/paymentService.js`

```javascript
import api from '../utils/axiosConfig'

export const paymentService = {
  async createPayment({ pesanan_id, jumlah, metode_pembayaran, channel }) {
    try {
      const response = await api.post('/payments/create', {
        pesanan_id,
        jumlah,
        metode_pembayaran,
        channel
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create payment',
        errors: error.response?.data?.errors || []
      }
    }
  },

  async getPaymentById(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment',
        errors: error.response?.data?.errors || []
      }
    }
  },

  async getPaymentByOrderId(orderId) {
    try {
      const response = await api.get(`/payments/order/${orderId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment',
        errors: error.response?.data?.errors || []
      }
    }
  },

  async releaseEscrow({ pesanan_id, jumlah }) {
    try {
      const response = await api.post('/payments/escrow/release', {
        pesanan_id,
        jumlah
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to release escrow',
        errors: error.response?.data?.errors || []
      }
    }
  },

  async requestRefund({ paymentId, alasan, jumlah_refund }) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        alasan,
        jumlah_refund
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to request refund',
        errors: error.response?.data?.errors || []
      }
    }
  },

  async getAnalytics(period = '30d') {
    try {
      const response = await api.get('/payments/analytics/summary', {
        params: { period }
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get analytics',
        errors: error.response?.data?.errors || []
      }
    }
  }
}
```

---

## 2. ATOM: Amount Input Component

**File**: `/src/components/atoms/AmountInput.jsx`

```jsx
export default function AmountInput({ 
  className = "", 
  value = "",
  onChange = () => {},
  currency = 'Rp',
  placeholder = '0',
  ...props 
}) {
  const formatCurrency = (val) => {
    if (!val) return ''
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '')
    onChange(numericValue)
  }

  return (
    <div className="relative">
      <span className="absolute left-4 top-3 text-[#2E2A28] font-semibold">
        {currency}
      </span>
      <input 
        type="text"
        value={formatCurrency(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-md bg-[#F5F0EB] text-[#2E2A28] placeholder-[#9C8C84] px-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#696969] border border-[#B3B3B3] ${className}`}
        {...props}
      />
    </div>
  )
}
```

---

## 3. ATOM: Payment Status Badge

**File**: `/src/components/atoms/PaymentStatusBadge.jsx`

```jsx
export default function PaymentStatusBadge({ status, className = '' }) {
  const statusStyles = {
    pending: 'bg-warning/10 text-warning border border-warning/30',
    berhasil: 'bg-success/10 text-success border border-success/30',
    gagal: 'bg-danger/10 text-danger border border-danger/30',
    cancelled: 'bg-gray-100 text-gray-600 border border-gray-300',
  }

  const statusLabels = {
    pending: 'Pending',
    berhasil: 'Berhasil',
    gagal: 'Gagal',
    cancelled: 'Dibatalkan',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || statusStyles.pending} ${className}`}>
      {statusLabels[status] || status}
    </span>
  )
}
```

---

## 4. MOLECULE: Payment Method Card

**File**: `/src/components/molecules/PaymentMethodCard.jsx`

```jsx
import Card from "../atoms/Card"
import Button from "../atoms/Button"

export default function PaymentMethodCard({ 
  method, 
  isSelected = false, 
  onSelect = () => {},
  icon = null
}) {
  return (
    <Card
      className={`cursor-pointer transition ${
        isSelected 
          ? 'border-[#4782BE] bg-[#D8E3F3]/20' 
          : 'hover:border-[#9DBBDD]'
      }`}
      onClick={() => onSelect(method.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h4 className="font-semibold text-[#1D375B]">{method.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          </div>
        </div>
        <input 
          type="radio"
          checked={isSelected}
          readOnly
          className="w-5 h-5 cursor-pointer"
        />
      </div>
    </Card>
  )
}
```

---

## 5. MOLECULE: Payment Form Card

**File**: `/src/components/molecules/PaymentFormCard.jsx`

```jsx
import Card from "../atoms/Card"
import Label from "../atoms/Label"
import Input from "../atoms/Input"
import AmountInput from "../atoms/AmountInput"
import Button from "../atoms/Button"

export default function PaymentFormCard({ 
  values, 
  onChange, 
  onCancel, 
  onSubmit,
  loading = false
}) {
  return (
    <Card
      title="Informasi Pembayaran"
      subtitle="Isi detail pembayaran Anda"
      className="h-full flex flex-col"
    >
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Label>
            Jumlah Pembayaran <span className="text-red-500">*</span>
          </Label>
          <AmountInput
            value={values.jumlah || ''}
            onChange={(val) => onChange({ jumlah: val })}
            placeholder="Masukkan jumlah"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Metode Pembayaran <span className="text-red-500">*</span>
          </Label>
          <select
            value={values.metode_pembayaran || ''}
            onChange={(e) => onChange({ metode_pembayaran: e.target.value })}
            className="w-full rounded-md bg-[#F5F0EB] text-[#2E2A28] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#696969] border border-[#B3B3B3]"
          >
            <option value="">Pilih Metode</option>
            <option value="credit_card">Kartu Kredit</option>
            <option value="bank_transfer">Transfer Bank</option>
            <option value="ewallet">E-Wallet</option>
          </select>
        </div>

        {values.metode_pembayaran && (
          <div className="space-y-2">
            <Label>
              Channel <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Contoh: visa, bca, gopay"
              value={values.channel || ''}
              onChange={(e) => onChange({ channel: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={loading || !values.jumlah || !values.metode_pembayaran}
        >
          {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </Button>
      </div>
    </Card>
  )
}
```

---

## 6. MOLECULE: Payment History Item

**File**: `/src/components/molecules/PaymentHistoryItem.jsx`

```jsx
import PaymentStatusBadge from "../atoms/PaymentStatusBadge"
import { ChevronRight } from 'lucide-react'

export default function PaymentHistoryItem({ 
  payment, 
  onClick = () => {}
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-[#1D375B]">
            Order #{payment.pesanan_id}
          </span>
          <PaymentStatusBadge status={payment.status} />
        </div>
        <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
        <p className="text-sm text-gray-500">{payment.metode_pembayaran}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-[#1D375B]">
          {formatCurrency(payment.jumlah)}
        </p>
        <ChevronRight size={20} className="text-gray-400 mt-2" />
      </div>
    </div>
  )
}
```

---

## 7. ORGANISM: Payment History List

**File**: `/src/components/organisms/PaymentHistoryList.jsx`

```jsx
import PaymentHistoryItem from "../molecules/PaymentHistoryItem"
import Spinner from "../atoms/Spinner"

export default function PaymentHistoryList({ 
  payments = [], 
  loading = false,
  onSelectPayment = () => {}
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Tidak ada riwayat pembayaran</p>
        <p className="text-gray-400 text-sm mt-2">Pembayaran Anda akan muncul di sini</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <PaymentHistoryItem
          key={payment.id}
          payment={payment}
          onClick={() => onSelectPayment(payment)}
        />
      ))}
    </div>
  )
}
```

---

## 8. PAGE: Payment Page

**File**: `/src/pages/PaymentPage.jsx`

```jsx
import { useState, useEffect } from 'react'
import Navbar from '../components/organisms/Navbar'
import PaymentFormCard from '../components/molecules/PaymentFormCard'
import PaymentHistoryList from '../components/organisms/PaymentHistoryList'
import LoadingOverlay from '../components/organisms/LoadingOverlay'
import { paymentService } from '../services/paymentService'

export default function PaymentPage() {
  const [form, setForm] = useState({
    jumlah: '',
    metode_pembayaran: '',
    channel: ''
  })
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPaymentHistory()
  }, [])

  const loadPaymentHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
      if (user) {
        // Fetch payment history from API
        // For now, using mock data
        setPayments([])
      }
    } catch (err) {
      setError('Gagal memuat riwayat pembayaran')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (updates) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!form.jumlah || !form.metode_pembayaran) {
        setError('Lengkapi semua field')
        setLoading(false)
        return
      }

      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
      
      const result = await paymentService.createPayment({
        pesanan_id: 1, // From order context
        jumlah: form.jumlah,
        metode_pembayaran: form.metode_pembayaran,
        channel: form.channel
      })

      if (result.success) {
        // Redirect to payment gateway
        if (result.data.payment_url) {
          window.location.href = result.data.payment_url
        }
        setForm({ jumlah: '', metode_pembayaran: '', channel: '' })
        setError(null)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Gagal membuat pembayaran')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({ jumlah: '', metode_pembayaran: '', channel: '' })
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay loading={loading} />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PaymentFormCard
              values={form}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Riwayat Pembayaran
              </h2>
              <PaymentHistoryList
                payments={payments}
                loading={loading}
                onSelectPayment={(payment) => {
                  console.log('Selected payment:', payment)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 9. Add Route to App.jsx

```jsx
// Add this import at top
import PaymentPage from "./pages/PaymentPage"

// Add this route in the Routes component
<Route
  path="/payment"
  element={
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  }
/>
```

---

## 10. ORGANISM: Order Payment Checkout

**File**: `/src/components/organisms/OrderPaymentCheckout.jsx`

```jsx
import { useState } from 'react'
import PaymentFormCard from "../molecules/PaymentFormCard"
import PaymentMethodCard from "../molecules/PaymentMethodCard"
import Card from "../atoms/Card"
import Text from "../atoms/Text"
import { paymentService } from '../../services/paymentService'

export default function OrderPaymentCheckout({ 
  order, 
  onPaymentSuccess = () => {},
  onPaymentFailed = () => {}
}) {
  const [step, setStep] = useState(1) // 1: Method, 2: Details, 3: Confirm
  const [form, setForm] = useState({
    jumlah: order?.jumlah || '',
    metode_pembayaran: '',
    channel: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const paymentMethods = [
    { id: 'credit_card', name: 'Kartu Kredit', description: 'Visa, Mastercard, Amex', icon: '💳' },
    { id: 'bank_transfer', name: 'Transfer Bank', description: 'Semua bank lokal', icon: '🏦' },
    { id: 'ewallet', name: 'E-Wallet', description: 'GoPay, OVO, Dana', icon: '📱' }
  ]

  const handleChange = (updates) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await paymentService.createPayment({
        pesanan_id: order.id,
        jumlah: form.jumlah,
        metode_pembayaran: form.metode_pembayaran,
        channel: form.channel
      })

      if (result.success) {
        onPaymentSuccess(result.data)
      } else {
        setError(result.message)
        onPaymentFailed(result)
      }
    } catch (err) {
      setError('Gagal memproses pembayaran')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card title="Ringkasan Pesanan">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium"># {order?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-lg text-[#1D375B]">
              Rp {Number(order?.jumlah).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </Card>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1D375B]">Pilih Metode Pembayaran</h3>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              icon={method.icon}
              isSelected={form.metode_pembayaran === method.id}
              onSelect={() => {
                handleChange({ metode_pembayaran: method.id })
                setStep(2)
              }}
            />
          ))}
        </div>
      )}

      {step === 2 && (
        <PaymentFormCard
          values={form}
          onChange={handleChange}
          onCancel={() => setStep(1)}
          onSubmit={() => setStep(3)}
          loading={loading}
        />
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card title="Konfirmasi Pembayaran">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Metode</span>
                <span className="font-medium capitalize">{form.metode_pembayaran?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-medium">Rp {Number(form.jumlah).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border border-[#4782BE] text-[#4782BE] rounded-lg hover:bg-[#D8E3F3]/20 transition"
                disabled={loading}
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#4782BE] text-white rounded-lg hover:bg-[#9DBBDD] transition"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
```

---

## Component Reuse Examples

### Reusing Existing Atoms
```jsx
// Button variants
<Button variant="primary">Bayar</Button>
<Button variant="outline">Batal</Button>

// Input variants
<Input placeholder="Amount" />
<AmountInput value={amount} onChange={setAmount} />

// Status badges
<PaymentStatusBadge status="pending" />
<PaymentStatusBadge status="berhasil" />

// Cards
<Card title="Title" subtitle="Subtitle">
  Content here
</Card>
```

### Combining Molecules
```jsx
// Payment form combining multiple molecules
<div className="space-y-4">
  <PaymentMethodCard {...props} />
  <PaymentFormCard {...props} />
  <PaymentHistoryItem {...props} />
</div>
```

### Template Pattern
```jsx
// Create a payment template for layouts
export function PaymentTemplate({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
```

