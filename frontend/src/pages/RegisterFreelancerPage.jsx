import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout";
import AuthCard from "../components/organisms/AuthCard";
import FormGroup from "../components/molecules/FormGroup";
import Button from "../components/atoms/Button";
import { authService } from "../services/authService";
import { validateName } from "../utils/validators";
import LoadingOverlay from "../components/organisms/LoadingOverlay";
import { useToast } from "../components/organisms/ToastProvider";
import { authService } from "../services/authService";

export default function RegisterFreelancerPage() {
  const [form, setForm] = useState({
    nama_lengkap: "",
    gelar: "",
    no_telepon: "",
    deskripsi: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const result = await authService.registerWithGoogle(tokenResponse.access_token, 'freelancer');
        
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
    }
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.show("Silakan login terlebih dahulu", "info");
      navigate("/login", { replace: true });
      return;
    }

    // Check if user is already a freelancer
    const user = authService.getCurrentUser();
    if (user && user.role === "freelancer") {
      toast.show("Anda sudah terdaftar sebagai freelancer", "info");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, toast]);

  const onChange = (e) => {
    const value = e.target.value;
    setForm((s) => ({ ...s, [e.target.name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const newErrors = {
      nama_lengkap: validateName(form.nama_lengkap, "Nama lengkap"),
      gelar: form.gelar.trim() ? null : "Gelar wajib diisi",
      no_telepon: form.no_telepon.trim() ? null : "Nomor telepon wajib diisi",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    setError(null);

    try {
      const result = await authService.createFreelancerProfile({
        nama_lengkap: form.nama_lengkap,
        gelar: form.gelar,
        no_telepon: form.no_telepon,
        deskripsi: form.deskripsi || undefined,
      });

      if (result.success) {
        toast.show("Profil freelancer berhasil dibuat!", "success");
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.message || "Gagal membuat profil freelancer");
        toast.show(result.message || "Gagal membuat profil freelancer", "error");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal membuat profil freelancer";
      setError(errorMessage);
      toast.show(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register Freelancer"
      bottom={
        <div className="absolute top-4 right-6 font-body text-[#112D4E]">
          Di sini untuk merekrut pekerja?{" "}
          <Link to="/register/client" className="underline">
            Bergabung sebagai Klien
          </Link>
        </div>
      }
    >
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
          <FormGroup label="Nama Lengkap" name="nama_lengkap" value={form.nama_lengkap} onChange={onChange} error={errors.nama_lengkap} required />
          <FormGroup label="Gelar" name="gelar" value={form.gelar} onChange={onChange} error={errors.gelar} placeholder="Contoh: Web Developer, Graphic Designer, dll" required />
          <FormGroup label="Nomor Telepon" name="no_telepon" type="tel" value={form.no_telepon} onChange={onChange} error={errors.no_telepon} required />
          <div className="mb-4 sm:mb-5">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-[#1B1B1B] mb-1.5 sm:mb-2">
              Deskripsi / Bio
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={onChange}
              placeholder="Ceritakan tentang diri Anda (opsional)"
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[#B3B3B3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:border-transparent text-sm sm:text-base"
            />
            {errors.deskripsi && <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.deskripsi}</p>}
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
          <Button 
            variant="outline" 
            className="w-full" 
            icon={<Icon name="google" size="md" />}
            onClick={handleGoogleRegister}
            disabled={googleLoading || loading}
          >
            {googleLoading ? "Memproses..." : "Lanjutkan dengan Google"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
