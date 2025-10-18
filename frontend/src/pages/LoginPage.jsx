import { useState } from 'react'
import AuthLayout from '../components/templates/AuthLayout'
import AuthCard from '../components/organisms/AuthCard'
import FormGroup from '../components/molecules/FormGroup'
import Button from '../components/atoms/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword } from '../utils/validators'
import LoadingOverlay from '../components/organisms/LoadingOverlay'
import { useToast } from '../components/organisms/ToastProvider'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }))

  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const toast = useToast()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailErr = validateEmail(form.email)
    const passErr = validatePassword(form.password)
    const newErrors = { email: emailErr, password: passErr }
    setErrors(newErrors)
    if (emailErr || passErr) return
    try {
      await login(form)
      toast.show('Logged in successfully', 'success')
      navigate('/dashboard', { replace: true })
    } catch (_) {
      toast.show('Invalid email or password', 'error')
    }
  }

  const footer = (
    <div className="mt-6">
      <div className="flex items-center gap-4 text-[#C7B9A7]">
        <div className="flex-1 h-px bg-[#C7B9A7]" />
        <span>OR</span>
        <div className="flex-1 h-px bg-[#C7B9A7]" />
      </div>
      <Button variant="outline" className="w-full mt-4">Continue with Google</Button>
      <div className="text-center mt-4">
        <a className="text-[#3A2B2A] underline">Forget your password?</a>
      </div>
    </div>
  )

  return (
    <AuthLayout
      title="Login"
      bottom={(
        <div className="w-full max-w-xl">
          <div className="bg-[#D8CCBC] rounded-lg px-6 py-4 text-center text-[#3A2B2A]">
            Don't have an account? <Link to="/register/client" className="underline">Sign up</Link>
          </div>
        </div>
      )}
    >
      <LoadingOverlay show={loading} text="Signing in..." />
      <AuthCard title="Log In To Skill Connect" footer={footer}>
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Email address"
            name="email"
            type="email"
            placeholder=""
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormGroup
            label="Your password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" variant="neutral" className="w-full" disabled={loading}>{loading ? 'Loading...' : 'Log in'}</Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}


