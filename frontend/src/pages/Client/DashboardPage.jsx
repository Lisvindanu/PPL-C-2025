import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Components - Fragments
import Navbar from "../../components/Fragments/Common/Navbar";
import Footer from "../../components/Fragments/Common/Footer";
import DashboardHeaderBar from "../../components/Fragments/Dashboard/DashboardHeaderBar";
import SaldoSummaryCard, { SaldoIcon, TransferIcon } from "../../components/Fragments/Order/SaldoSummaryCard";
import TransactionList from "../../components/Fragments/Order/TransactionList";
import { SaldoTersediaCard, DanaDitahanCard, InfoPembayaranCard } from "../../components/Fragments/Order/SaldoInfoCard";

// Services
import { orderService } from "../../services/orderService";

// Freelancer Dashboard Component
function FreelancerDashboard({ user }) {
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    akumulasiSaldo: 0,
    siapTransfer: 0,
    saldoTersedia: 0,
    danaInProgress: 0,
    danaPendingReview: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await orderService.getIncomingOrders({
        sortBy: "created_at",
        sortOrder: "DESC",
        page: 1,
        limit: 100,
      });

      if (res?.success === false) {
        setError(res?.message || "Gagal memuat order masuk");
        setIncomingOrders([]);
        setLoading(false);
        return;
      }

      const raw =
        res?.data?.items ||
        res?.data?.rows ||
        res?.data?.orders ||
        res?.data ||
        res?.items ||
        [];

      const mapped = (Array.isArray(raw) ? raw : []).map((o) => ({
        id: o.id ?? o.order_id ?? o.uuid,
        nomor: o.nomor_pesanan ?? o.order_number ?? o.nomor,
        judul: o.judul ?? o.title ?? "Tanpa Judul",
        clientName: `${o.client?.nama_depan || o.client_first_name || ""} ${o.client?.nama_belakang || o.client_last_name || ""}`.trim() || o.client?.full_name || "Client",
        companyName: o.client?.company_name || o.company_name || "",
        waktuPengerjaanHari: o.waktu_pengerjaan ?? o.duration_days ?? o.waktu ?? 0,
        deadline: o.tenggat_waktu || o.deadline || o.due_date,
        total: o.total_bayar ?? o.total ?? o.harga ?? 0,
        status: o.status || "menunggu_pembayaran",
        createdAt: o.created_at || o.createdAt,
      }));

      setIncomingOrders(mapped);

      let akumulasi = 0;
      let siapTransfer = 0;
      let inProgress = 0;
      let pendingReview = 0;

      mapped.forEach((order) => {
        const amount = Number(order.total || 0);
        if (order.status === "selesai") {
          akumulasi += amount;
          siapTransfer += amount;
        } else if (order.status === "dikerjakan" || order.status === "dibayar") {
          akumulasi += amount;
          inProgress += amount;
        } else if (order.status === "in_review" || order.status === "pending") {
          akumulasi += amount;
          pendingReview += amount;
        }
      });

      setSummary({
        akumulasiSaldo: akumulasi,
        siapTransfer: siapTransfer,
        saldoTersedia: siapTransfer,
        danaInProgress: inProgress,
        danaPendingReview: pendingReview,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Terjadi kesalahan saat memuat data");
      setLoading(false);
    }
  };

  const handleTarikSaldo = () => {
    console.log("Tarik saldo clicked");
  };

  return (
    <div className="min-h-screen bg-[#E8EEF7]">
      <Navbar />

      <DashboardHeaderBar
        title="Freelancer"
        subPage="Dashboard"
        active="dashboard"
      />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Summary Cards - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SaldoSummaryCard
            title="Akumulasi Saldo (Rupiah)"
            value={summary.akumulasiSaldo}
            icon={<SaldoIcon />}
            variant="primary"
          />
          <SaldoSummaryCard
            title="Jumlah siap transfer (Rupiah)"
            value={summary.siapTransfer}
            icon={<TransferIcon />}
            variant="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transaction History (2/3 width) */}
          <div className="lg:col-span-2">
            <TransactionList
              title="Riwayat Transaksi"
              orders={incomingOrders}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column - Saldo Info (1/3 width) */}
          <div className="space-y-4">
            <SaldoTersediaCard
              saldo={summary.saldoTersedia}
              onTarikSaldo={handleTarikSaldo}
            />

            <DanaDitahanCard
              totalDitahan={summary.danaInProgress + summary.danaPendingReview}
              inProgress={summary.danaInProgress}
              pendingReview={summary.danaPendingReview}
            />

            <InfoPembayaranCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Client Dashboard Component
function ClientDashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{user ? `, ${user.nama_depan || user.email}` : ""}!
          </h1>
          <p className="text-gray-600 mb-8">
            You are logged in. This is your dashboard where you can manage your
            account and activities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage your personal information and professional details.
              </p>
              <Link
                to="/profile"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Profile →
              </Link>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cari Layanan
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Temukan freelancer dan layanan yang sesuai kebutuhanmu.
              </p>
              <Link
                to="/services"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Lihat Layanan →
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pesanan Saya
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Lihat dan kelola pesanan yang sedang berjalan.
              </p>
              <Link
                to="/orders"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Lihat Pesanan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page - Routes based on user role
export default function DashboardPage() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  // If freelancer, show freelancer dashboard
  if (user?.role === "freelancer") {
    return <FreelancerDashboard user={user} />;
  }

  // Default to client dashboard
  return <ClientDashboard user={user} />;
}
