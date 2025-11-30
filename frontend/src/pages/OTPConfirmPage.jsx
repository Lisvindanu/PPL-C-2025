import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResetPasswordLayout from "../components/organisms/ResetPasswordLayout";
import ResetPasswordCard from "../components/organisms/ResetPasswordCard";
import ResetPasswordButton from "../components/atoms/ResetPasswordButton";
import OTPInput from "../components/molecules/OTPInput";
import MockInfoCard from "../components/organisms/MockInfoCard";
import { useToast } from "../components/organisms/ToastProvider";
import hybridResetPasswordService from "../services/hybridResetPasswordService";

export default function OTPConfirmPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); 
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setToken(location.state.token || "");
    } else {
      navigate("/forgot-password", { replace: true });
    }
  }, [location.state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    if (resending || timeLeft > 540) return; 

    setResending(true);
    setError("");

    try {
      const result = await hybridResetPasswordService.sendOTP(email, null, ['email']);

      if (result.success) {
        toast.show("Kode OTP baru telah dikirim", "success");
        setTimeLeft(600); 
        setOtp(""); 
        
        // Show OTP in console for development
        if (result.data.otpCode) {
          console.log("🔧 Development OTP Code:", result.data.otpCode);
          toast.show(`Dev OTP: ${result.data.otpCode}`, "info");
        }
      } else {
        setError(result.message || "Gagal mengirim ulang OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat mengirim ulang OTP");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: OTP must be filled
    if (!otp || otp.length === 0) {
      setError("Kode OTP harus diisi");
      toast.show("Silakan masukkan kode OTP", "error");
      return;
    }

    // Validation: OTP must be 6 digits
    if (otp.length !== 6) {
      setError("Kode OTP harus 6 digit");
      toast.show("Kode OTP harus 6 digit", "error");
      return;
    }

    // Validation: OTP must be numbers only
    if (!/^\d{6}$/.test(otp)) {
      setError("Kode OTP harus berupa angka");
      toast.show("Kode OTP harus berupa angka", "error");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use hybrid service (mock + real API)
      const result = await hybridResetPasswordService.verifyOTP(email, otp);

      if (result.success) {
        toast.show("Kode OTP berhasil diverifikasi", "success");
        navigate("/reset-password/new-password", {
          state: { email, token: result.data.token },
          replace: true,
        });
      } else {
        // Handle specific error messages
        const errorMessage = result.message || "Kode OTP tidak valid";
        setError(errorMessage);
        
        if (errorMessage.includes("expired") || errorMessage.includes("kadaluarsa")) {
          toast.show("Kode OTP telah kadaluarsa. Silakan kirim ulang.", "error");
        } else if (errorMessage.includes("already used") || errorMessage.includes("sudah digunakan")) {
          toast.show("Kode OTP sudah digunakan. Silakan kirim ulang.", "error");
        } else if (errorMessage.includes("Invalid") || errorMessage.includes("tidak valid")) {
          toast.show("Kode OTP salah. Silakan coba lagi.", "error");
        } else {
          toast.show(errorMessage, "error");
        }
        
        // Clear OTP input on error
        setOtp("");
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = "Terjadi kesalahan saat memverifikasi kode OTP";
      setError(errorMsg);
      toast.show(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="mt-6 text-center space-y-2">
      <div className="text-sm text-gray-600">
        {timeLeft > 0 ? (
          <span>Kode berlaku: <strong className="text-blue-600">{formatTime(timeLeft)}</strong></span>
        ) : (
          <span className="text-red-600 font-semibold">Kode telah kadaluarsa</span>
        )}
      </div>
      <button 
        onClick={handleResendOTP}
        disabled={resending || timeLeft > 540}
        className={`text-[#3A2B2A] underline hover:no-underline ${(resending || timeLeft > 540) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {resending ? "Mengirim..." : "Kirim ulang kode OTP"}
      </button>
      {timeLeft > 540 && (
        <div className="text-xs text-gray-500">
          Tunggu {Math.ceil((timeLeft - 540) / 60)} menit untuk kirim ulang
        </div>
      )}
    </div>
  );

  return (
    <ResetPasswordLayout title="OTP Confirm" bottom={footer}>
      <div className="w-full max-w-md">
        <ResetPasswordCard title="Verifikasi Kode OTP" hasHeader={true}>
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">
              Masukkan kode OTP yang telah dikirim ke
            </p>
            <p className="font-semibold text-gray-800">{email}</p>
          </div>

          <MockInfoCard email={email} />
          
          <form onSubmit={handleSubmit}>
            <OTPInput 
              value={otp} 
              onChange={setOtp} 
              length={6}
              disabled={loading}
              error={!!error}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <ResetPasswordButton type="submit" disabled={loading || otp.length !== 6}>
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </ResetPasswordButton>
          </form>
        </ResetPasswordCard>
      </div>
    </ResetPasswordLayout>
  );
}
