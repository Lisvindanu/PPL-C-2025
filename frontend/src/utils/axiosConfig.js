import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Logging disabled for cleaner console
    // if (import.meta.env.DEV) {
    //   console.log('[axiosConfig] Request:', {
    //     method: config.method,
    //     url: config.url,
    //     baseURL: config.baseURL,
    //     fullURL: `${config.baseURL}${config.url}`
    //   })
    // }
    return config
  },
  (error) => {
    console.error('[axiosConfig] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Logging disabled for cleaner console
    // if (import.meta.env.DEV) {
    //   console.log('[axiosConfig] Response:', {
    //     status: response.status,
    //     url: response.config.url
    //   })
    // }
    return response
  },
  (error) => {
    // Only log actual errors
    if (error.response?.status !== 401) {
      console.error('[axiosConfig] Response error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message
      })
    }
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

