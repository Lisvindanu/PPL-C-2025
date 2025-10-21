import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/templates/AuthLayout'
import AuthCard from '../components/organisms/AuthCard'
import FormGroup from '../components/molecules/FormGroup'
import Button from '../components/atoms/Button'
import RoleCard from '../components/molecules/RoleCard'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword, validateName } from '../utils/validators'
import LoadingOverlay from '../components/organisms/LoadingOverlay'
import { useToast } from '../components/organisms/ToastProvider'

export default function RegisterClientPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }))

  const { register, loading, error } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    const newErrors = {
      firstName: validateName(form.firstName, 'First name'),
      lastName: validateName(form.lastName, 'Last name'),
      email: validateEmail(form.email),
      password: validatePassword(form.password)
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    try {
      await register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, role: 'client' })
      toast.show('Account created. Please login.', 'success')
      navigate('/login', { replace: true })
    } catch (_) {
      toast.show('Registration failed', 'error')
    }
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === 'client') {
      setStep(2)
    } else {
      navigate('/register/freelancer')
    }
  }

  if (step === 1) {
    return (
      <AuthLayout>
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-[#1B1B1B] text-3xl mb-8 font-medium font-title">Bergabung sebagai klien atau pekerja lepas</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <RoleCard
              title="Saya seorang klien, sedang merekrut untuk sebuah proyek"
              icon={<div className="w-4 h-4 bg-[#4B0713] rounded-full"></div>}
              selected={role === 'client'}
              onClick={() => handleRoleSelect('client')}
            />
            <RoleCard
              title="Saya seorang pekerja lepas, sedang mencari pekerjaan"
              icon={<div className="w-4 h-4 bg-[#4B0713] rounded-full"></div>}
              selected={role === 'freelancer'}
              onClick={() => handleRoleSelect('freelancer')}
            />
          </div>
          <Button variant="role" className="px-8" onClick={() => setStep(2)}>
            Bergabung sebagai Klien
          </Button>
          <div className="text-center mt-4 text-sm text-[#1B1B1B] font-body">
            Sudah punya akun? <Link to="/login" className="underline">Masuk</Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Register Client"
      bottom={(
        <div className="w-full max-w-xl text-right text-[#1B1B1B]">
          Mencari pekerjaan? <Link to="/register/freelancer" className="underline">Bergabung sebagai Freelancer</Link>
        </div>
      )}
    >
      <LoadingOverlay show={loading} text="Creating account..." />
      <AuthCard title="Buat Akun">
        <div className="text-right mb-4">
          <Link to="/login" className="text-[#1B1B1B] text-sm underline">Masuk</Link>
        </div>
        <form onSubmit={submit}>
          <FormGroup label="Nama Pertama" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
          <FormGroup label="Nama Terakhir" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
          <FormGroup label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
          <FormGroup label="Kata Sandi" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} />
          <div className="text-sm text-[#6C5A55] mb-4">
            <input type="checkbox" className="mr-2" /> Dengan membuat akun, saya setuju dengan <a href="#" className="underline">Ketentuan</a> dan <a href="#" className="underline">Kebijakan Privasi</a> kami.
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" variant="neutral" className="w-full" disabled={loading}>{loading ? 'Loading...' : 'Buat Akun'}</Button>
          <div className="flex items-center gap-4 text-[#8a8a8a] my-4">
            <div className="flex-1 h-px bg-[#B3B3B3]" />
            <span>Atau</span>
            <div className="flex-1 h-px bg-[#B3B3B3]" />
          </div>
          <Button variant="outline" className="w-full">Lanjutkan dengan Google</Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}