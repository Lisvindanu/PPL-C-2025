import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import DashboardHeaderBar from "../../components/molecules/DashboardHeaderBar";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";

export default function OrdersIncomingPage() {
  const navigate = useNavigate();
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError("");
      const res = await orderService.getIncomingOrders({
        sortBy: "created_at",
        sortOrder: "DESC",
        page: 1,
        limit: 10,
      });

      if (!isMounted) return;

      if (res?.success === false) {
        setError(res?.message || "Gagal memuat order masuk");
        setIncomingOrders([]);
        setLoading(false);
        return;
      }

      // Normalisasi payload (dukung beberapa kemungkinan bentuk response)
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
        clientName: `${o.client?.nama_depan || o.client_first_name || ""} ${o.client?.nama_belakang || o.client_last_name || ""}`.trim(),
        waktuPengerjaanHari: o.waktu_pengerjaan ?? o.duration_days ?? o.waktu ?? 0,
        deadline: o.tenggat_waktu || o.deadline || o.due_date ? new Date(o.tenggat_waktu || o.deadline || o.due_date).toLocaleDateString("id-ID") : "-",
        total: o.total_bayar ?? o.total ?? o.harga ?? 0,
        statusBadge: o.status === "dibayar" ? "Menunggu Konfirmasi" : "Menunggu Pembayaran",
      }));

      setIncomingOrders(mapped);
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
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

        {loading && (
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
            Memuat data...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && incomingOrders.length === 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
            Belum ada pesanan masuk.
          </div>
        )}

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


