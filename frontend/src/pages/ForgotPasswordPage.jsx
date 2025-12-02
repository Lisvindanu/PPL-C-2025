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
  const [phoneNumber, setPhoneNumber] = useState('')
  const [channels, setChannels] = useState(['email'])
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
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use new sendOTP method with multi-channel support
      const result = await hybridResetPasswordService.sendOTP(
        email,
        channels.includes('whatsapp') ? phoneNumber : null,
        channels
      );

      if (result.success) {
        // Build success message based on channels
        let message = "Kode OTP telah dikirim";
        if (channels.includes('email') && channels.includes('whatsapp')) {
          message += " ke email dan WhatsApp Anda";
        } else if (channels.includes('email')) {
          message += " ke email Anda";
        } else if (channels.includes('whatsapp')) {
          message += " ke WhatsApp Anda";
        }
        
        toast.show(message, "success");

        // Show OTP in console for development
        if (result.data.otpCode) {
          console.log("🔧 Development OTP Code:", result.data.otpCode);
          toast.show(`Dev OTP: ${result.data.otpCode}`, "info");
        }

        navigate("/reset-password/otp", {
          state: { email, token: result.data?.token },
          replace: true,
        });
      } else {
        setError(result.message || "Terjadi kesalahan saat mengirim kode OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat mengirim kode OTP");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="mt-6 text-center">
      <button onClick={() => navigate("/login")} className="text-[#1B1B1B] underline hover:no-underline">
        Kembali ke Login
      </button>
    </div>
  );

  return (
    <>
      <HybridModeController />
      <ResetPasswordLayout title="Reset Password" bottom={footer}>
        <div className="w-full max-w-md">
          <ResetPasswordCard title="Atur Ulang Kata Sandi">
            <form onSubmit={handleSubmit}>
              <ResetPasswordFormGroup 
                label="Alamat Email" 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                error={error} 
              />

              {/* Channel Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kirim OTP via:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={channels.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setChannels([...channels, 'email'])
                        } else {
                          setChannels(channels.filter(c => c !== 'email'))
                        }
                      }}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={channels.includes('whatsapp')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setChannels([...channels, 'whatsapp'])
                        } else {
                          setChannels(channels.filter(c => c !== 'whatsapp'))
                        }
                      }}
                      className="mr-2"
                    />
                    WhatsApp
                  </label>
                </div>
              </div>

              {/* Phone Number (conditional) */}
              {channels.includes('whatsapp') && (
                <ResetPasswordFormGroup 
                  label="Nomor WhatsApp" 
                  name="phoneNumber" 
                  type="tel" 
                  placeholder="628123456789" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                />
              )}

              <ResetPasswordButton type="submit" disabled={loading || channels.length === 0}>
                {loading ? "Mengirim..." : "Kirim OTP"}
              </ResetPasswordButton>
            </form>
          </ResetPasswordCard>
        </div>
      </ResetPasswordLayout>
    </>
  );
}
