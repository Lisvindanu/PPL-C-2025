import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: clear localStorage anyway
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">SC</span>
            </div>
            <span className="font-semibold text-gray-900">Skill Connect</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">
                {user ? `${user.nama_depan || 'User'}` : 'Profile'}
              </span>
            </Link>
            
            <Button variant="outline" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{user ? `, ${user.nama_depan || user.email}` : ''}!
          </h1>
          <p className="text-gray-600 mb-8">
            You are logged in. This is your dashboard where you can manage your account and activities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Manage your personal information and professional details.</p>
              <Link to="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Profile →
              </Link>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Browse and manage freelance services.</p>
              <span className="text-green-600 text-sm font-medium">Coming Soon</span>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Track your orders and project progress.</p>
              <span className="text-purple-600 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


