import { useState } from 'react'
import { authService } from '../services/authService'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (payload) => {
    setLoading(true); setError(null)
    try {
      const { data } = await authService.login(payload)
      const { token, user } = data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setLoading(false)
      return user
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
      setLoading(false)
      throw e
    }
  }

  const register = async (payload) => {
    setLoading(true); setError(null)
    try {
      const { data } = await authService.register(payload)
      setLoading(false)
      return data
    } catch (e) {
      setError(e.response?.data?.message || 'Register failed')
      setLoading(false)
      throw e
    }
  }

  return { login, register, loading, error }
}


