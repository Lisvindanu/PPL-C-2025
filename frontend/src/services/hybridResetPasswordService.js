// Hybrid service: Mock UI + Real Database Integration
class HybridResetPasswordService {
  constructor() {
    this.useMock = true // Set to false untuk menggunakan real API
    this.baseURL = 'http://localhost:5000/api/users'
    
    // Mock data untuk UI testing
    this.mockData = {
      users: [
        { 
          email: 'admin@skillconnect.com', 
          password: 'password123',
          role: 'admin',
          nama_depan: 'Admin',
          nama_belakang: 'SkillConnect'
        },
        { 
          email: 'client@skillconnect.com', 
          password: 'password123',
          role: 'client',
          nama_depan: 'John',
          nama_belakang: 'Doe'
        },
        { 
          email: 'freelancer@skillconnect.com', 
          password: 'password123',
          role: 'freelancer',
          nama_depan: 'Jane',
          nama_belakang: 'Smith'
        },
        { 
          email: 'client2@skillconnect.com', 
          password: 'password123',
          role: 'client',
          nama_depan: 'Alice',
          nama_belakang: 'Johnson'
        },
        { 
          email: 'freelancer2@skillconnect.com', 
          password: 'password123',
          role: 'freelancer',
          nama_depan: 'Bob',
          nama_belakang: 'Williams'
        }
      ],
      tokens: new Map(),
      otpCodes: new Map()
    }
    
    this.loadMockData()
  }

  // Toggle antara mock dan real API
  setMockMode(useMock) {
    this.useMock = useMock
    console.log(`🔧 Hybrid Service: ${useMock ? 'Mock Mode' : 'Real API Mode'}`)
  }

  // Simulate API delay
  async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Load mock data from localStorage
  loadMockData() {
    try {
      const saved = localStorage.getItem('hybridResetPasswordData')
      if (saved) {
        const parsed = JSON.parse(saved)
        this.mockData.users = parsed.users || this.mockData.users
        this.mockData.tokens = new Map(parsed.tokens || [])
        this.mockData.otpCodes = new Map(parsed.otpCodes || [])
      }
    } catch (error) {
      console.log('No existing hybrid mock data found, using defaults')
    }
  }

  // Save mock data to localStorage
  saveMockData() {
    try {
      const dataToSave = {
        users: this.mockData.users,
        tokens: Array.from(this.mockData.tokens.entries()),
        otpCodes: Array.from(this.mockData.otpCodes.entries())
      }
      localStorage.setItem('hybridResetPasswordData', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving hybrid mock data:', error)
    }
  }

  // Send OTP - New method with multi-channel support
  async sendOTP(email, phoneNumber = null, channels = ['email']) {
    if (this.useMock) {
      return await this.mockForgotPassword(email)
    } else {
      return await this.realSendOTP(email, phoneNumber, channels)
    }
  }

  // Real API - Send OTP with multi-channel
  async realSendOTP(email, phoneNumber = null, channels = ['email']) {
    try {
      console.log('🔧 Hybrid Real API: Send OTP for:', email, 'via', channels)
      
      const response = await fetch(`${this.baseURL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          phoneNumber,
          purpose: 'password_reset',
          channels
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('🔧 Hybrid Real API: OTP sent successfully')
        // In development, show OTP if available
        if (result.data.otp) {
          console.log('🔧 Development OTP:', result.data.otp)
        }
        return {
          success: true,
          data: {
            message: result.data.message || 'OTP has been sent',
            channels: result.data.channels,
            otpCode: result.data.otp, // For development
            expiresIn: result.data.expiresIn
          }
        }
      } else {
        console.error('🔧 Hybrid Real API: Error:', result.message)
        return result
      }
    } catch (error) {
      console.error('🔧 Hybrid Real API: Network error:', error)
      throw error
    }
  }

  // Forgot Password - Hybrid approach (backward compatible)
  async forgotPassword(email) {
    if (this.useMock) {
      return await this.mockForgotPassword(email)
    } else {
      return await this.realForgotPassword(email)
    }
  }

  // Mock implementation
  async mockForgotPassword(email) {
    await this.delay(800)
    
    console.log('🔧 Hybrid Mock: Forgot Password Request for:', email)
    
    const user = this.mockData.users.find(u => u.email === email)
    if (!user) {
      return {
        success: true,
        data: {
          message: 'If the email exists, a reset token was generated',
          token: null
        }
      }
    }

    const token = this.generateMockToken()
    const otpCode = this.generateMockOTP()
    
    this.mockData.tokens.set(email, {
      token,
      otpCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      used: false
    })
    
    this.saveMockData()
    
    console.log('🔧 Hybrid Mock: Generated token:', token)
    console.log('🔧 Hybrid Mock: Generated OTP:', otpCode)
    
    return {
      success: true,
      data: {
        message: 'Password reset token generated',
        token: token,
        otpCode: otpCode
      }
    }
  }

  // Real API implementation - Updated to use new OTP endpoint
  async realForgotPassword(email) {
    try {
      console.log('🔧 Hybrid Real API: Forgot Password Request for:', email)
      
      const response = await fetch(`${this.baseURL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          channels: ['email'] 
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('🔧 Hybrid Real API: OTP sent successfully')
        // In development, show OTP if available
        if (result.data.otp) {
          console.log('🔧 Development OTP:', result.data.otp)
        }
        return {
          success: true,
          data: {
            message: result.data.message || 'OTP has been sent',
            token: result.data.token,
            otpCode: result.data.otp // For development
          }
        }
      } else {
        console.error('🔧 Hybrid Real API: Error:', result.message)
        return result
      }
    } catch (error) {
      console.error('🔧 Hybrid Real API: Network error:', error)
      throw error
    }
  }

  // Verify OTP - Hybrid approach
  async verifyOTP(email, otp) {
    if (this.useMock) {
      return await this.mockVerifyOTP(email, otp)
    } else {
      return await this.realVerifyOTP(email, otp)
    }
  }

  // Mock implementation
  async mockVerifyOTP(email, otp) {
    await this.delay(600)
    
    console.log('🔧 Hybrid Mock: Verify OTP for:', email, 'with OTP:', otp)
    
    const tokenData = this.mockData.tokens.get(email)
    if (!tokenData) {
      return {
        success: false,
        message: 'No reset token found for this email'
      }
    }

    if (tokenData.used) {
      return {
        success: false,
        message: 'Token already used'
      }
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      return {
        success: false,
        message: 'Token expired'
      }
    }

    if (tokenData.otpCode !== otp) {
      return {
        success: false,
        message: 'Invalid OTP code'
      }
    }

    const verifiedToken = this.generateMockToken()
    tokenData.verifiedToken = verifiedToken
    tokenData.otpVerified = true
    
    this.saveMockData()
    
    console.log('🔧 Hybrid Mock: OTP verified, generated verified token:', verifiedToken)
    
    return {
      success: true,
      data: {
        message: 'OTP verified successfully',
        token: verifiedToken
      }
    }
  }

  // Real API implementation
  async realVerifyOTP(email, otp) {
    try {
      console.log('🔧 Hybrid Real API: Verify OTP for:', email)
      
      const response = await fetch(`${this.baseURL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('🔧 Hybrid Real API: OTP verified successfully')
        return result
      } else {
        console.error('🔧 Hybrid Real API: Error:', result.message)
        return result
      }
    } catch (error) {
      console.error('🔧 Hybrid Real API: Network error:', error)
      throw error
    }
  }

  // Reset Password - Hybrid approach with Database Integration
  async resetPassword(email, token, newPassword) {
    if (this.useMock) {
      return await this.mockResetPassword(email, token, newPassword)
    } else {
      return await this.realResetPassword(email, token, newPassword)
    }
  }

  // Mock implementation with Database Update
  async mockResetPassword(email, token, newPassword) {
    await this.delay(700)
    
    console.log('🔧 Hybrid Mock: Reset password for:', email, 'with token:', token)
    
    const tokenData = this.mockData.tokens.get(email)
    if (!tokenData) {
      return {
        success: false,
        message: 'No reset token found for this email'
      }
    }

    if (!tokenData.otpVerified || tokenData.verifiedToken !== token) {
      return {
        success: false,
        message: 'Invalid or unverified token'
      }
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      return {
        success: false,
        message: 'Token expired'
      }
    }

    // Update password in mock data
    const user = this.mockData.users.find(u => u.email === email)
    if (user) {
      user.password = newPassword
      console.log('🔧 Hybrid Mock: Password updated in mock data for user:', email)
    }

    // UPDATE DATABASE DIRECTLY (bypass token validation)
    try {
      console.log('🔧 Hybrid Mock: Updating database directly...')
      const dbResult = await this.updatePasswordDirectly(email, newPassword)
      
      if (dbResult.success) {
        console.log('🔧 Hybrid Mock: Database updated successfully')
      } else {
        console.warn('🔧 Hybrid Mock: Database update failed:', dbResult.message)
        // Still return success for mock, but warn about database
        return {
          success: true,
          data: {
            message: 'Password updated in mock data (database update failed - check backend)'
          }
        }
      }
    } catch (error) {
      console.warn('🔧 Hybrid Mock: Database update failed (network error):', error.message)
      // Still return success for mock, but warn about database
      return {
        success: true,
        data: {
          message: 'Password updated in mock data (database update failed - check backend)'
        }
      }
    }

    // Mark token as used
    tokenData.used = true
    this.saveMockData()
    
    return {
      success: true,
      data: {
        message: 'Password updated successfully (mock + database)'
      }
    }
  }

  // Direct password update (bypass token validation)
  async updatePasswordDirectly(email, newPassword) {
    try {
      console.log('🔧 Hybrid Direct: Updating password for:', email)
      
      const response = await fetch(`${this.baseURL}/update-password-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          newPassword 
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('🔧 Hybrid Direct: Password updated in database successfully')
        return result
      } else {
        console.error('🔧 Hybrid Direct: Error:', result.message)
        return result
      }
    } catch (error) {
      console.error('🔧 Hybrid Direct: Network error:', error)
      throw error
    }
  }

  // Real API implementation
  async realResetPassword(email, token, newPassword) {
    try {
      console.log('🔧 Hybrid Real API: Reset password for:', email)
      
      const response = await fetch(`${this.baseURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          token, 
          newPassword 
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('🔧 Hybrid Real API: Password updated in database successfully')
        return result
      } else {
        console.error('🔧 Hybrid Real API: Error:', result.message)
        return result
      }
    } catch (error) {
      console.error('🔧 Hybrid Real API: Network error:', error)
      throw error
    }
  }

  // Helper methods
  generateMockToken() {
    return 'hybrid-token-' + Math.random().toString(36).substr(2, 9)
  }

  generateMockOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Get current OTP for email (for testing)
  getCurrentOTP(email) {
    const tokenData = this.mockData.tokens.get(email)
    return tokenData ? tokenData.otpCode : null
  }

  // Get mock data for debugging
  getMockData() {
    return {
      users: this.mockData.users,
      tokens: Object.fromEntries(this.mockData.tokens),
      otpCodes: Object.fromEntries(this.mockData.otpCodes)
    }
  }

  // Clear mock data
  clearMockData() {
    this.mockData.tokens.clear()
    this.mockData.otpCodes.clear()
    localStorage.removeItem('hybridResetPasswordData')
    console.log('🔧 Hybrid: Mock data cleared')
  }

  // Get current mode
  getCurrentMode() {
    return this.useMock ? 'Mock Mode' : 'Real API Mode'
  }
}

// Create singleton instance
const hybridResetPasswordService = new HybridResetPasswordService()

export default hybridResetPasswordService
