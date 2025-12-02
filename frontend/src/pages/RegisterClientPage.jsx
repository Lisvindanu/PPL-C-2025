import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout";
import AuthCard from "../components/organisms/AuthCard";
import FormGroup from "../components/molecules/FormGroup";
import Button from "../components/atoms/Button";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword, validateName } from "../utils/validators";
import LoadingOverlay from "../components/organisms/LoadingOverlay";
import { useToast } from "../components/organisms/ToastProvider";
import Icon from "../components/atoms/Icon";
import { authService } from "../services/authService";

export default function RegisterClientPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", ketentuan_agree: false });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });
  
  const onChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [e.target.name]: value }));
  };

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
    setForm((s) => ({ ...s, password: value }));
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const result = await authService.registerWithGoogle(tokenResponse.access_token, "client");

        if (result.success) {
          toast.show("Account created and logged in with Google", "success");
          navigate("/dashboard", { replace: true });
        } else {
          toast.show(result.message || "Google registration failed", "error");
        }
      } catch (err) {
        console.error("Google registration error:", err);
        toast.show("Google registration failed", "error");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.show("Google authentication failed", "error");
      setGoogleLoading(false);
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.show("Anda sudah login", "info");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, toast]);

  const submit = async (e) => {
    e.preventDefault();
    const newErrors = {
      firstName: validateName(form.firstName, "First name"),
      lastName: validateName(form.lastName, "Last name"),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: !form.confirmPassword ? "Konfirmasi password harus diisi" : 
                       form.password !== form.confirmPassword ? "Password dan konfirmasi harus sama" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.show("Mohon lengkapi semua field dengan benar", "error");
      return;
    }

    try {
      const result = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        ketentuan_agree: form.ketentuan_agree,
      });
      
      // Show OTP in development
      if (result?.otp) {
        console.log("🔧 Development OTP:", result.otp);
        toast.show(`Dev OTP: ${result.otp}`, "info");
      }
      
      toast.show("Account created. Please verify your email.", "success");
      navigate("/verify-email", { 
        state: { email: form.email },
        replace: true 
      });
    } catch (_) {
      toast.show("Registration failed", "error");
    }
  };

  return (
    <AuthLayout title="Register Client">
      <LoadingOverlay show={loading || googleLoading} text="Creating account..." />
      <AuthCard
        title="Buat Akun"
        headerRight={
          <Link to="/login" className="text-[#1B1B1B] text-sm underline">
            {" "}
            Masuk
          </Link>
        }
      >
        <form onSubmit={submit}>
          <FormGroup label="Nama Pertama" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
          <FormGroup label="Nama Terakhir" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
          <FormGroup label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
          <FormGroup label="Kata Sandi" name="password" type="password" value={form.password} onChange={handlePasswordChange} error={errors.password} />
          
          {/* Password Strength Indicator */}
          {form.password && (
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
                  <li className={form.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    {form.password.length >= 8 ? '✓' : '○'} Minimal 8 karakter
                  </li>
                  <li className={/[a-zA-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[a-zA-Z]/.test(form.password) ? '✓' : '○'} Huruf (a-z, A-Z)
                  </li>
                  <li className={/\d/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/\d/.test(form.password) ? '✓' : '○'} Angka (0-9)
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? '✓' : '○'} Simbol (!@#$%^&*)
                  </li>
                </ul>
              </div>
            </div>
          )}

          <FormGroup label="Konfirmasi Kata Sandi" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
          
          <div className="text-sm text-[#112D4E] mb-4">
            <input type="checkbox" name="ketentuan_agree" checked={form.ketentuan_agree} onChange={onChange} className="mr-2" required /> Dengan membuat akun, saya setuju dengan{" "}
            <a href="#" className="underline">
              Ketentuan
            </a>{" "}
            dan{" "}
            <a href="#" className="underline">
              Kebijakan Privasi
            </a>{" "}
            kami.
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" variant="neutral" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Buat Akun"}
          </Button>
          <div className="flex items-center gap-4 text-[#8a8a8a] my-4">
            <div className="flex-1 h-px bg-[#B3B3B3]" />
            <span>Atau</span>
            <div className="flex-1 h-px bg-[#B3B3B3]" />
          </div>
          <Button variant="outline" className="w-full" icon={<Icon name="google" size="md" />} onClick={handleGoogleRegister} disabled={googleLoading || loading}>
            {googleLoading ? "Memproses..." : "Lanjutkan dengan Google"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
