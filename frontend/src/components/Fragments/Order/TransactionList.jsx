/**
 * TransactionList - List transaksi dengan filter tabs
 * Digunakan di halaman OrdersIncomingPage
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Elements/Layout/Card";
import Badge from "../../Elements/Common/Badge";
import Spinner from "../../Elements/Common/Spinner";

// Helper: format currency
const formatRupiah = (num) => {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Status configuration with badge variants
const getStatusConfig = (status) => {
  const statusMap = {
    menunggu_pembayaran: {
      label: "Menunggu Pembayaran",
      variant: "warning",
      bgCard: "bg-yellow-50",
      borderCard: "border-l-yellow-400",
      textColor: "text-yellow-700",
    },
    pending: {
      label: "Pending",
      variant: "warning",
      bgCard: "bg-orange-50",
      borderCard: "border-l-orange-400",
      textColor: "text-orange-700",
    },
    dibayar: {
      label: "Dibayar",
      variant: "primary",
      bgCard: "bg-blue-50",
      borderCard: "border-l-blue-400",
      textColor: "text-blue-700",
    },
    dikerjakan: {
      label: "Dikerjakan",
      variant: "primary",
      bgCard: "bg-cyan-50",
      borderCard: "border-l-cyan-400",
      textColor: "text-cyan-700",
    },
    in_review: {
      label: "In Review",
      variant: "primary",
      bgCard: "bg-purple-50",
      borderCard: "border-l-purple-400",
      textColor: "text-purple-700",
    },
    selesai: {
      label: "Selesai",
      variant: "success",
      bgCard: "bg-green-50",
      borderCard: "border-l-green-400",
      textColor: "text-green-700",
    },
    dibatalkan: {
      label: "Dibatalkan",
      variant: "error",
      bgCard: "bg-red-50",
      borderCard: "border-l-red-400",
      textColor: "text-red-700",
    },
  };
  return statusMap[status] || {
    label: status || "Unknown",
    variant: "default",
    bgCard: "bg-gray-50",
    borderCard: "border-l-gray-400",
    textColor: "text-gray-700",
  };
};

// Status message for each order
const getStatusMessage = (status) => {
  const messages = {
    menunggu_pembayaran: "Menunggu pembayaran dari klien",
    pending: "Dana ditahan hingga pekerjaan selesai",
    dibayar: "Dana ditahan hingga pekerjaan selesai",
    dikerjakan: "Dana ditahan hingga pekerjaan selesai",
    in_review: "Menunggu review dari klien",
    selesai: "Dana berhasil masuk ke saldo",
    dibatalkan: "Pesanan dibatalkan",
  };
  return messages[status] || "";
};

// Default tab filters
const defaultTabFilters = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "dibayar", label: "Berhasil" },
  { value: "dikerjakan", label: "Dikerjakan" },
  { value: "in_review", label: "In Review" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

// Single Transaction Item
function TransactionItem({ order, onClick }) {
  const statusConfig = getStatusConfig(order.status);
  const statusMessage = getStatusMessage(order.status);

  return (
    <div
      className={`p-4 border-l-4 ${statusConfig.borderCard} ${statusConfig.bgCard} hover:bg-opacity-80 cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{order.judul}</h3>
            <Badge variant={statusConfig.variant}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {order.companyName || order.clientName} • ORD-{order.nomor?.slice(0, 3) || "000"} • {formatDate(order.createdAt)}
          </p>
          {statusMessage && (
            <p className={`text-sm mt-1 ${statusConfig.textColor}`}>
              {order.status === "selesai" ? "✓" : order.status === "dibatalkan" ? "✗" : "○"} {statusMessage}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className={`font-semibold ${order.status === "selesai" ? "text-green-600" : "text-gray-900"}`}>
            {order.status === "selesai" ? "+" : ""}{formatRupiah(order.total)}
          </p>
          <p className="text-xs text-gray-500">
            {order.status === "selesai" ? "Saldo diterima" : "Dana ditahan"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TransactionList({
  title = "Riwayat Transaksi",
  orders = [],
  loading = false,
  error = "",
  tabFilters = defaultTabFilters,
  onOrderClick,
  className = "",
}) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtered orders based on active tab
  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  const handleOrderClick = (order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

  return (
    <Card className={`!p-0 overflow-hidden ${className}`}>
      {/* Header with Title and Filter Tabs */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Tab Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {tabFilters.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === tab.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {loading && (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Spinner size={32} color="#3B82F6" />
            <p className="mt-3">Memuat data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-8 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Tidak ada transaksi ditemukan
          </div>
        )}

        {!loading && !error && filteredOrders.map((order) => (
          <TransactionItem
            key={order.id}
            order={order}
            onClick={() => handleOrderClick(order)}
          />
        ))}
      </div>
    </Card>
  );
}

// Export individual components for flexibility
export { TransactionItem, getStatusConfig, getStatusMessage };
