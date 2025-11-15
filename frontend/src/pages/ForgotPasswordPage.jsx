import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ResetPasswordLayout from '../components/organisms/ResetPasswordLayout'
import ResetPasswordCard from '../components/organisms/ResetPasswordCard'
import ResetPasswordFormGroup from '../components/molecules/ResetPasswordFormGroup'
import ResetPasswordButton from '../components/atoms/ResetPasswordButton'
import { validateEmail } from '../utils/validators'
import { useToast } from '../components/organisms/ToastProvider'
import hybridResetPasswordService from '../services/hybridResetPasswordService'
import HybridModeController from '../components/organisms/HybridModeController'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.show("Anda sudah login", "info");
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Use hybrid service (mock + real API)
      const result = await hybridResetPasswordService.forgotPassword(email)

      if (result.success) {
        toast.show('Kode OTP telah dikirim ke email Anda', 'success')
        
        // Show OTP in console for development
        if (result.data.otpCode) {
          console.log('🔧 Mock OTP Code:', result.data.otpCode)
          toast.show(`Mock OTP: ${result.data.otpCode}`, 'info')
        }
        
        navigate('/reset-password/otp', { 
          state: { email, token: result.data?.token },
          replace: true 
        })
      } else {
        setError(result.message || 'Terjadi kesalahan saat mengirim kode OTP')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Terjadi kesalahan saat mengirim kode OTP')
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <div className="mt-6 text-center">
      <button 
        onClick={() => navigate('/login')}
        className="text-[#3A2B2A] underline hover:no-underline"
      >
        Kembali ke Login
      </button>
    </div>
  )

  return (
    <>
      <HybridModeController />
      <ResetPasswordLayout
        title="Reset Password"
        bottom={footer}
      >
        <div className="w-full max-w-md">
          <ResetPasswordCard title="Atur Ulang Kata Sandi">
            <form onSubmit={handleSubmit}>
              <ResetPasswordFormGroup
                label="Alamat Email"
                name="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />

              <ResetPasswordButton 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Kirim'}
              </ResetPasswordButton>
            </form>
          </ResetPasswordCard>
        </div>
      </ResetPasswordLayout>
    </>
  )
}
