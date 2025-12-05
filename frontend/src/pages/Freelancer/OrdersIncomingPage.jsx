import { useEffect, useState } from "react";

// Components - Fragments
import Navbar from "../../components/Fragments/Common/Navbar";
import Footer from "../../components/Fragments/Common/Footer";
import DashboardHeaderBar from "../../components/Fragments/Dashboard/DashboardHeaderBar";
import SaldoSummaryCard, { SaldoIcon, TransferIcon } from "../../components/Fragments/Order/SaldoSummaryCard";
import TransactionList from "../../components/Fragments/Order/TransactionList";
import { SaldoTersediaCard, DanaDitahanCard, InfoPembayaranCard } from "../../components/Fragments/Order/SaldoInfoCard";

// Services
import { orderService } from "../../services/orderService";

export default function OrdersIncomingPage() {
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Summary data state
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

      // Normalize payload
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

      // Calculate summary from orders
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
    // TODO: Implement tarik saldo functionality
    console.log("Tarik saldo clicked");
  };

  return (
    <div className="min-h-screen bg-[#E8EEF7]">
      <Navbar />

      <DashboardHeaderBar
        title="Freelancer"
        subPage="Order Masuk"
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
