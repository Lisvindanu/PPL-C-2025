import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout";
import AuthCard from "../components/organisms/AuthCard";
import Button from "../components/atoms/Button";
import OTPInput from "../components/molecules/OTPInput";
import { useToast } from "../components/organisms/ToastProvider";
import { authService } from "../services/authService";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to register
      navigate("/register-client", { replace: true });
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
      const result = await authService.verifyEmail(email, otp);

      if (result.success) {
        toast.show("Email berhasil diverifikasi! Silakan login.", "success");
        navigate("/login", { replace: true });
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
      const errorMsg = "Terjadi kesalahan saat memverifikasi OTP";
      setError(errorMsg);
      toast.show(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resending || timeLeft > 540) return; // Can resend after 1 minute

    setResending(true);
    setError("");

    try {
      const result = await authService.resendVerificationOTP(email);

      if (result.success) {
        toast.show("New OTP has been sent to your email", "success");
        setTimeLeft(600); // Reset timer
        setOtp(""); // Clear OTP input
        
        // Show OTP in console for development
        if (result.data?.otp) {
          console.log("🔧 Development OTP:", result.data.otp);
          toast.show(`Dev OTP: ${result.data.otp}`, "info");
        }
      } else {
        setError(result.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Verify Email">
      <AuthCard title="Verifikasi Email">
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm mb-2">
            Kami telah mengirim kode OTP ke
          </p>
          <p className="font-semibold text-gray-800">{email}</p>
          <p className="text-gray-500 text-xs mt-2">
            Silakan cek inbox atau folder spam Anda
          </p>
        </div>

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

          <div className="text-center mb-4">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Kode berlaku: <strong className="text-blue-600">{formatTime(timeLeft)}</strong>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">
                Kode telah kadaluarsa
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            variant="neutral" 
            className="w-full mb-3" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Memverifikasi..." : "Verifikasi Email"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending || timeLeft > 540}
              className={`text-sm text-blue-600 underline hover:no-underline ${
                (resending || timeLeft > 540) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resending ? "Mengirim..." : "Kirim ulang kode OTP"}
            </button>
            {timeLeft > 540 && (
              <p className="text-xs text-gray-500 mt-1">
                Tunggu {Math.ceil((timeLeft - 540) / 60)} menit untuk kirim ulang
              </p>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Kembali ke Login
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
