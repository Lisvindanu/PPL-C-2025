import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResetPasswordLayout from "../components/organisms/ResetPasswordLayout";
import ResetPasswordCard from "../components/organisms/ResetPasswordCard";
import ResetPasswordFormGroup from "../components/molecules/ResetPasswordFormGroup";
import ResetPasswordButton from "../components/atoms/ResetPasswordButton";
import { validatePassword } from "../utils/validators";
import { useToast } from "../components/organisms/ToastProvider";
import hybridResetPasswordService from "../services/hybridResetPasswordService";

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

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

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password dan konfirmasi harus sama");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await hybridResetPasswordService.resetPassword(email, token, newPassword);

      if (result.success) {
        toast.show("Password berhasil diubah", "success");
        navigate("/login", { replace: true });
      } else {
        setError(result.message || "Terjadi kesalahan saat mengubah password");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat mengubah password");
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
              onChange={(e) => setNewPassword(e.target.value)}
              error={error && !confirmPassword ? error : ""}
            />

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
