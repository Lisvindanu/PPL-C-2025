import { useState } from "react";
import AuthLayout from "../components/templates/AuthLayout";
import AuthCard from "../components/organisms/AuthCard";
import FormGroup from "../components/molecules/FormGroup";
import Button from "../components/atoms/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validators";
import LoadingOverlay from "../components/organisms/LoadingOverlay";
import { useToast } from "../components/organisms/ToastProvider";
import Icon from "../components/atoms/Icon";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const newErrors = { email: emailErr, password: passErr };
    setErrors(newErrors);
    if (emailErr || passErr) return;
    try {
      const user = await login(form);
      toast.show("Logged in successfully", "success");
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate("/admin/dashboardadmin", { replace: true });
      } else if (user.role === 'freelancer' || user.role === 'client') {
        navigate("/dashboard", { replace: true });
      } else {
        // Fallback untuk role yang tidak dikenal
        navigate("/dashboard", { replace: true });
      }
    } catch (_) {
      toast.show("Invalid email or password", "error");
    }
  };

  const footer = (
    <div className="mt-6">
      <div className="flex items-center gap-4 text-[#8a8a8a]">
        <div className="flex-1 h-px bg-[#B3B3B3]" />
        <span>Atau</span>
        <div className="flex-1 h-px bg-[#B3B3B3]" />
      </div>
      <Button variant="outline" className="w-full mt-4" icon={<Icon name="google" size="md" />}>
        Lanjutkan dengan Google
      </Button>
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-[#112D4E] underline hover:no-underline">
          Lupa kata sandi Anda?
        </Link>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Login"
      bottom={
        <div className="w-full max-w-xl shadow-md">
          <div className="bg-[#f9f7f8] rounded-lg px-6 py-4 text-center text-[#112D4E]">
            Belum punya akun?{" "}
            <Link to="/register/client" className="underline">
              Daftar
            </Link>
          </div>
        </div>
      }
    >
      <LoadingOverlay show={loading} text="Signing in..." />
      <AuthCard title="Masuk ke Skill Connect" footer={footer}>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Alamat Email" name="email" type="email" placeholder="" value={form.email} onChange={handleChange} error={errors.email} />
          <FormGroup label="Password Anda" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" variant="neutral" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Masuk"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
