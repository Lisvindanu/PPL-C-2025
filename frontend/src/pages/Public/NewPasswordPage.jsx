import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResetPasswordLayout from "../../components/Fragments/Auth/ResetPasswordLayout";
import ResetPasswordCard from "../../components/Fragments/Auth/ResetPasswordCard";
import ResetPasswordFormGroup from "../../components/Fragments/Auth/ResetPasswordFormGroup";
import ResetPasswordButton from "../../components/Fragments/Auth/ResetPasswordButton";
import { validatePassword } from "../../utils/validators";
import { useToast } from "../../components/Fragments/Common/ToastProvider";
import hybridResetPasswordService from "../../services/hybridResetPasswordService";

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLong: password.length >= 12,
    };

    if (checks.length) score++;
    if (checks.hasLetter) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSymbol) score++;
    if (checks.isLong) score++;

    const strength = {
      0: { text: "", color: "" },
      1: { text: "Sangat Lemah", color: "text-red-600" },
      2: { text: "Lemah", color: "text-orange-600" },
      3: { text: "Sedang", color: "text-yellow-600" },
      4: { text: "Kuat", color: "text-green-600" },
      5: { text: "Sangat Kuat", color: "text-green-700" },
    };

    return { score, ...strength[score] };
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  useEffect(() => {
    if (location.state?.email && location.state?.token) {
      setEmail(location.state.email);
      setToken(location.state.token);
    } else {
      navigate("/forgot-password", { replace: true });
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Validation 1: Password must be filled
    if (!newPassword) {
      const errorMsg = "Password baru harus diisi";
      setError(errorMsg);
      toast.show(errorMsg, "error");
      return;
    }

    // Validation 2: Password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      toast.show(passwordError, "error");
      return;
    }

    // Validation 3: Confirm password must be filled
    if (!confirmPassword) {
      const errorMsg = "Konfirmasi password harus diisi";
      setError(errorMsg);
      toast.show(errorMsg, "error");
      return;
    }

    // Validation 4: Passwords must match
    if (newPassword !== confirmPassword) {
      const errorMsg = "Password dan konfirmasi harus sama";
      setError(errorMsg);
      toast.show(errorMsg, "error");
      return;
    }

    setLoading(true);

    try {
      const result = await hybridResetPasswordService.resetPassword(email, token, newPassword);

      if (result.success) {
        toast.show("Password berhasil diubah! Silakan login dengan password baru.", "success");
        navigate("/login", { replace: true });
      } else {
        // Handle specific error messages from backend
        const errorMessage = result.message || "Terjadi kesalahan saat mengubah password";
        setError(errorMessage);
        
        // Show specific toast messages
        if (errorMessage.includes("same as old password") || errorMessage.includes("sama dengan password lama")) {
          toast.show("Password baru tidak boleh sama dengan password lama", "error");
        } else if (errorMessage.includes("expired") || errorMessage.includes("kadaluarsa")) {
          toast.show("Token telah kadaluarsa. Silakan request reset password lagi.", "error");
        } else if (errorMessage.includes("already used") || errorMessage.includes("sudah digunakan")) {
          toast.show("Token sudah digunakan. Silakan request reset password lagi.", "error");
        } else if (errorMessage.includes("Invalid") || errorMessage.includes("tidak valid")) {
          toast.show("Token tidak valid. Silakan request reset password lagi.", "error");
        } else {
          toast.show(errorMessage, "error");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = "Terjadi kesalahan saat mengubah password";
      setError(errorMsg);
      toast.show(errorMsg, "error");
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
    <ResetPasswordLayout title="New Password" bottom={footer}>
      <div className="w-full max-w-md">
        <ResetPasswordCard title="Kata Sandi Baru" hasHeader={true}>
          <form onSubmit={handleSubmit}>
            <ResetPasswordFormGroup
              label="Kata Sandi Baru"
              name="newPassword"
              type="password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={handlePasswordChange}
              error={error && !confirmPassword ? error : ""}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mb-4 -mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score === 1 ? 'bg-red-600 w-1/5' :
                        passwordStrength.score === 2 ? 'bg-orange-600 w-2/5' :
                        passwordStrength.score === 3 ? 'bg-yellow-600 w-3/5' :
                        passwordStrength.score === 4 ? 'bg-green-600 w-4/5' :
                        passwordStrength.score === 5 ? 'bg-green-700 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <p className="mb-1">Password harus memiliki:</p>
                  <ul className="space-y-0.5 ml-4">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      {newPassword.length >= 8 ? '✓' : '○'} Minimal 8 karakter
                    </li>
                    <li className={/[a-zA-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      {/[a-zA-Z]/.test(newPassword) ? '✓' : '○'} Huruf (a-z, A-Z)
                    </li>
                    <li className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      {/\d/.test(newPassword) ? '✓' : '○'} Angka (0-9)
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'} Simbol (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <ResetPasswordFormGroup
              label="Verifikasi Kata Sandi"
              name="confirmPassword"
              type="password"
              placeholder="Masukkan ulang password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error && confirmPassword ? error : ""}
            />

            <ResetPasswordButton type="submit" disabled={loading}>
              {loading ? "Mengubah..." : "Kirim"}
            </ResetPasswordButton>
          </form>
        </ResetPasswordCard>
      </div>
    </ResetPasswordLayout>
  );
}
