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

  const getProfile = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await authService.getProfile()
      setLoading(false)
      return data
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to get profile')
      setLoading(false)
      throw e
    }
  }

  const updateProfile = async (data) => {
    setLoading(true); setError(null)
    try {
      const { data: result } = await authService.updateProfile(data)
      setLoading(false)
      return result
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile')
      setLoading(false)
      throw e
    }
  }

  const logout = async () => {
    setLoading(true); setError(null)
    try {
      await authService.logout()
      setLoading(false)
    } catch (e) {
      setError(e.response?.data?.message || 'Logout failed')
      setLoading(false)
      throw e
    }
  }

  return { login, register, getProfile, updateProfile, logout, loading, error }
}


