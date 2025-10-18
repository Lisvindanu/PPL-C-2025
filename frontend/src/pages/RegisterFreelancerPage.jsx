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

export default function RegisterFreelancerPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('freelancer')
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
      await register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, role: 'freelancer' })
      toast.show('Account created. Please login.', 'success')
      navigate('/login', { replace: true })
    } catch (_) {
      toast.show('Registration failed', 'error')
    }
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === 'freelancer') {
      setStep(2)
    } else {
      navigate('/register/client')
    }
  }

  if (step === 1) {
    return (
      <AuthLayout title="Register Freelancer">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-[#D8CCBC] text-xl mb-8">Join as a client or freelancer</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <RoleCard
              title="I'm a client, hiring for project"
              description="Looking to hire talented freelancers"
              icon={<div className="w-4 h-4 bg-[#4B0713] rounded-full"></div>}
              selected={role === 'client'}
              onClick={() => handleRoleSelect('client')}
            />
            <RoleCard
              title="I'm a freelancer, looking for work"
              description="Ready to showcase your skills"
              icon={<div className="w-4 h-4 bg-[#4B0713] rounded-full"></div>}
              selected={role === 'freelancer'}
              onClick={() => handleRoleSelect('freelancer')}
            />
          </div>
          <Button variant="role" className="px-8" onClick={() => setStep(2)}>
            Apply as a Freelancer
          </Button>
          <div className="text-center mt-4 text-sm text-[#D8CCBC]">
            Already had account? <Link to="/login" className="underline">Log in</Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Register Freelancer"
      bottom={(
        <div className="w-full max-w-xl text-right text-[#D8CCBC]">
          Here to hire a talent? <Link to="/register/client" className="underline">Join as a Client</Link>
        </div>
      )}
    >
      <LoadingOverlay show={loading} text="Creating account..." />
      <AuthCard title="Create an account">
        <div className="text-right mb-4">
          <Link to="/login" className="text-[#6C5A55] text-sm underline">log in instead</Link>
        </div>
        <form onSubmit={submit}>
          <FormGroup label="First name" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
          <FormGroup label="Last name" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
          <FormGroup label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
          <FormGroup label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} />
          <div className="text-sm text-[#6C5A55] mb-4">
            <input type="checkbox" className="mr-2" /> By creating an account, I agree to our <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" variant="neutral" className="w-full" disabled={loading}>{loading ? 'Loading...' : 'Create an account'}</Button>
          <div className="flex items-center gap-4 text-[#C7B9A7] my-4">
            <div className="flex-1 h-px bg-[#C7B9A7]" />
            <span>OR</span>
            <div className="flex-1 h-px bg-[#C7B9A7]" />
          </div>
          <Button variant="outline" className="w-full">Continue with Google</Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}