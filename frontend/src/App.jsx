import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterClientPage from "./pages/RegisterClientPage";
import RegisterFreelancerPage from "./pages/RegisterFreelancerPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/templates/ProtectedRoute";
import ServicePage from "./pages/freelance/ServicePage";
import ServiceCreatePage from "./pages/freelance/ServiceCreatePage";
import MessagesPage from "./pages/MessagesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/client" element={<RegisterClientPage />} />
      <Route path="/register/freelancer" element={<RegisterFreelancerPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelance/service"
        element={
          <ProtectedRoute>
            <ServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelance/service/new"
        element={
          <ProtectedRoute>
            <ServiceCreatePage />
          </ProtectedRoute>
        }
      />
      <Route path="/chat/messages" element={<MessagesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
