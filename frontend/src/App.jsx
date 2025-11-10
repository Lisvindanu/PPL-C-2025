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
import ServiceDetailPage from "./pages/jobs/ServiceDetailPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentPendingPage from "./pages/payment/PaymentPendingPage";
import PaymentErrorPage from "./pages/payment/PaymentErrorPage";
import PaymentExpiredPage from "./pages/payment/PaymentExpiredPage";
import PaymentGatewayPage from "./pages/payment/PaymentGatewayPage";
import PaymentProcessingPage from "./pages/payment/PaymentProcessingPage";
import BookmarkPage from "./pages/BookmarkPage";
import ServiceListPage from "./pages/ServiceListPage";
import CreateOrderPage from "./pages/CreateOrderPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/client" element={<RegisterClientPage />} />
      <Route path="/register/freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/services" element={<ServiceListPage />} />
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
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <BookmarkPage />
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
        path="/freelance/service/new"
        element={
          <ProtectedRoute>
            <ServiceCreatePage />
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
        path="/services"
        element={
          <ProtectedRoute>
            <ServiceListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id"
        element={
          <ProtectedRoute>
            <ServiceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <ServiceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-order/:id"
        element={
          <ProtectedRoute>
            <CreateOrderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/payment/:orderId" element={<PaymentGatewayPage />} />
      <Route path="/payment/processing/:paymentId" element={<PaymentProcessingPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/pending" element={<PaymentPendingPage />} />
      <Route path="/payment/error" element={<PaymentErrorPage />} />
      <Route path="/payment/expired" element={<PaymentExpiredPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
