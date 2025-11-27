import { useState, useEffect } from "react";
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

export default function RegisterClientPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", ketentuan_agree: false });
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [e.target.name]: value }));
  };

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.show("Anda sudah login", "info");
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, toast]);

  const submit = async (e) => {
    e.preventDefault();
    const newErrors = {
      firstName: validateName(form.firstName, "First name"),
      lastName: validateName(form.lastName, "Last name"),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        ketentuan_agree: form.ketentuan_agree,
      });
      toast.show("Account created. Please login.", "success");
      navigate("/login", { replace: true });
    } catch (_) {
      toast.show("Registration failed", "error");
    }
  };

  return (
    <AuthLayout title="Register Client">
      <LoadingOverlay show={loading} text="Creating account..." />
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
          <FormGroup label="Kata Sandi" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} />
          <div className="text-sm text-[#112D4E] mb-4">
            <input 
            type="checkbox" 
            name="ketentuan_agree" 
            checked={form.ketentuan_agree} 
            onChange={onChange} 
            className="mr-2" 
            required 
            /> Dengan membuat akun, saya setuju dengan{" "}
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
          <Button variant="outline" className="w-full" icon={<Icon name="google" size="md" />}>
            Lanjutkan dengan Google
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
