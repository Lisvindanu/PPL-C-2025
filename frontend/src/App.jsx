import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterClientPage from './pages/RegisterClientPage'
import RegisterFreelancerPage from './pages/RegisterFreelancerPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OTPConfirmPage from './pages/OTPConfirmPage'
import NewPasswordPage from './pages/NewPasswordPage'
import ProtectedRoute from './components/templates/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/client" element={<RegisterClientPage />} />
      <Route path="/register/freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/otp" element={<OTPConfirmPage />} />
      <Route path="/reset-password/new-password" element={<NewPasswordPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}


