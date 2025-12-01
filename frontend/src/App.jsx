import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterClientPage from "./pages/RegisterClientPage";
import RegisterFreelancerPage from "./pages/RegisterFreelancerPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminServiceManagementPage from "./pages/AdminServiceManagementPage";
import AdminCategoryManagementPage from "./pages/AdminCategoryManagementPage";
import AdminSubCategoryManagementPage from "./pages/AdminSubCategoryManagementPage";
import TransactionTrendsPage from "./pages/TransactionTrendsPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritePage from "./pages/FavoritePage";
import RiwayatPesananPage from "./pages/RiwayatPesananPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";
import FreelancerDetailPage from "./pages/FreelancerDetailPage";
import HiddenRecommendationsPage from "./pages/HiddenRecommendationsPage";
import ProtectedRoute from "./components/templates/ProtectedRoute";
import ServicePage from "./pages/freelance/ServicePage";
import ServiceCreatePage from "./pages/freelance/ServiceCreatePage";
import ServiceEditPage from "./pages/freelance/ServiceEditPage";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OTPConfirmPage from "./pages/OTPConfirmPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import OrderListPage from "./pages/OrderListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersIncomingPage from "./pages/freelance/OrdersIncomingPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRecommendationDashboardPage from "./pages/admin/AdminRecommendationDashboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/client" element={<RegisterClientPage />} />
      <Route path="/register/freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/otp" element={<OTPConfirmPage />} />
      <Route
        path="/reset-password/new-password"
        element={<NewPasswordPage />}
      />
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
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboardadmin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <AdminServiceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kategori"
        element={
          <ProtectedRoute>
            <AdminCategoryManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subkategori"
        element={
          <ProtectedRoute>
            <AdminSubCategoryManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transaction-trends"
        element={
          <ProtectedRoute>
            <TransactionTrendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recommendations"
        element={
          <ProtectedRoute>
            <AdminRecommendationDashboardPage />
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
        path="/favorit"
        element={
          <ProtectedRoute>
            <FavoritePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hide-rekomendasi"
        element={
          <ProtectedRoute>
            <HiddenRecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat-pesanan"
        element={
          <ProtectedRoute>
            <RiwayatPesananPage />
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
        path="/freelance/service/:id/edit"
        element={
          <ProtectedRoute>
            <ServiceEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelance/orders"
        element={
          <ProtectedRoute>
            <OrdersIncomingPage />
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
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />
      <Route path="/freelancer/:id/detail" element={<FreelancerDetailPage />} />
      <Route path="/freelancer/:id" element={<FreelancerProfilePage />} />

      <Route path="/services/:slug" element={<ServiceDetailPage />} />

      <Route
        path="/create-order/:id"
        element={
          <ProtectedRoute>
            <CreateOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-order"
        element={
          <ProtectedRoute>
            <CreateOrderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/payment/:orderId" element={<PaymentGatewayPage />} />
      <Route
        path="/payment/processing/:paymentId"
        element={<PaymentProcessingPage />}
      />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/pending" element={<PaymentPendingPage />} />
      <Route path="/payment/error" element={<PaymentErrorPage />} />
      <Route path="/payment/expired" element={<PaymentExpiredPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
