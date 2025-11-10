import { useMemo } from "react";
import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import DashboardHeaderBar from "../../components/molecules/DashboardHeaderBar";
import { mockOrders } from "../../mocks/orderMockData";
import { useNavigate } from "react-router-dom";

export default function OrdersIncomingPage() {
  const navigate = useNavigate();

  // Ambil order yang relevan untuk "Order Masuk" (contoh: sudah dibayar → menunggu konfirmasi)
  const incomingOrders = useMemo(() => {
    return mockOrders
      .filter((o) => o.status === "dibayar" || o.status === "menunggu_pembayaran")
      .map((o) => ({
        id: o.id,
        nomor: o.nomor_pesanan,
        judul: o.judul,
        clientName: `${o.client?.nama_depan || ""} ${o.client?.nama_belakang || ""}`.trim(),
        waktuPengerjaanHari: o.waktu_pengerjaan,
        deadline: new Date(o.tenggat_waktu).toLocaleDateString("id-ID"),
        total: o.total_bayar,
        statusBadge:
          o.status === "dibayar" ? "Menunggu Konfirmasi" : "Menunggu Pembayaran",
      }));
  }, []);

  return (
    <div className="min-h-screen bg-[#E8EEF7]">
      {/* Navbar global */}
      <Navbar />

      {/* Header bar dashboard (breadcrumb + subnav) */}
      <DashboardHeaderBar
        title="Freelancer"
        subPage="Order Masuk"
        active="dashboard"
      />

      {/* Daftar Order Masuk */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="sr-only">Order Masuk</h2>

        <div className="space-y-5">
          {incomingOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="p-5 md:p-6">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-neutral-900">
                      {order.judul}
                    </h3>
                    <p className="text-[13px] text-neutral-600 mt-1">
                      Order <span className="font-medium">#{order.nomor}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                    {order.statusBadge}
                  </span>
                </div>

                {/* Meta rows */}
                <div className="mt-3 space-y-1.5 text-sm text-neutral-800">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user text-neutral-500"></i>
                    <span>
                      Klien: <span className="font-medium">{order.clientName}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-clock text-neutral-500"></i>
                    <span>
                      Waktu pengerjaan:{" "}
                      <span className="font-medium">{order.waktuPengerjaanHari} hari</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-calendar text-neutral-500"></i>
                    <span>
                      Deadline: <span className="font-medium">{order.deadline}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Card */}
              <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3 md:px-6">
                <div className="text-sm">
                  <p className="text-neutral-600">Total Pembayaran</p>
                  <p className="font-semibold text-neutral-900">
                    Rp {Number(order.total || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  Detail
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer global */}
      <Footer />
    </div>
  );
}


