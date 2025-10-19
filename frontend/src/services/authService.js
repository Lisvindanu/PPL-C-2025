import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authService = {
  async login({ email, password }) {
    const res = await api.post('/users/login', { email, password })
    return res.data
  },
  async register({ email, password, firstName, lastName, role }) {
    const res = await api.post('/users/register', { email, password, firstName, lastName, role })
    return res.data
  },
  async getProfile() {
    const res = await api.get('/users/profile')
    return res.data
  },
  async updateProfile(data) {
    const res = await api.put('/users/profile', data)
    return res.data
  },
  async logout() {
    const res = await api.post('/users/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return res.data
  },
  async forgotPassword(email) {
    const res = await api.post('/users/forgot-password', { email })
    return res.data
  },
  async resetPassword(token, newPassword) {
    const res = await api.post('/users/reset-password', { token, newPassword })
    return res.data
  }
}


