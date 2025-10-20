import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ResetPasswordLayout from '../components/organisms/ResetPasswordLayout'
import ResetPasswordCard from '../components/organisms/ResetPasswordCard'
import ResetPasswordFormGroup from '../components/molecules/ResetPasswordFormGroup'
import ResetPasswordButton from '../components/atoms/ResetPasswordButton'
import OTPConfirmHeader from '../components/organisms/OTPConfirmHeader'
import MockInfoCard from '../components/organisms/MockInfoCard'
import { useToast } from '../components/organisms/ToastProvider'
import hybridResetPasswordService from '../services/hybridResetPasswordService'

export default function OTPConfirmPage() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
      setToken(location.state.token || '')
    } else {
      navigate('/forgot-password', { replace: true })
    }
  }, [location.state, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!otp) {
      setError('Kode OTP harus diisi')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Use hybrid service (mock + real API)
      const result = await hybridResetPasswordService.verifyOTP(email, otp)

      if (result.success) {
        toast.show('Kode OTP berhasil diverifikasi', 'success')
        navigate('/reset-password/new-password', { 
          state: { email, token: result.data.token },
          replace: true 
        })
      } else {
        setError(result.message || 'Kode OTP tidak valid')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Terjadi kesalahan saat memverifikasi kode OTP')
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <div className="mt-6 text-center">
      <button 
        onClick={() => navigate('/forgot-password')}
        className="text-[#3A2B2A] underline hover:no-underline"
      >
        Kirim ulang kode OTP
      </button>
    </div>
  )

  return (
    <ResetPasswordLayout
      title="OTP Confirm"
      bottom={footer}
    >
      <div className="w-full max-w-md">
        <OTPConfirmHeader />
        <ResetPasswordCard title="Kode OTP" hasHeader={true}>
          <MockInfoCard email={email} />
          <form onSubmit={handleSubmit}>
            <ResetPasswordFormGroup
              label="Kode OTP"
              name="otp"
              type="text"
              placeholder="Masukkan kode OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
            />

            <ResetPasswordButton 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Memverifikasi...' : 'Kirim'}
            </ResetPasswordButton>
          </form>
        </ResetPasswordCard>
      </div>
    </ResetPasswordLayout>
  )
}
