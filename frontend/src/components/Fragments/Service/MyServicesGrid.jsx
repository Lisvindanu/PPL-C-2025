import { useEffect, useState, useMemo } from "react";
import MyServiceCard from "./MyServiceCard";
import Pagination from "../../Elements/Navigation/Pagination";
import Button from "../../Elements/Buttons/Button";
import { serviceService } from "../../../services/serviceService";

export default function MyServicesGrid() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const [state, setState] = useState({
    loading: true,
    error: "",
    items: [],
    pagination: { page: 1, totalPages: 1, total: 0 },
  });

  const params = useMemo(
    () => ({
      page,
      limit,
      sortBy: "updated_at",
      sortDir: "desc",
    }),
    [page]
  );

  async function load() {
    try {
      setState((s) => ({ ...s, loading: true, error: "" }));
      const res = await serviceService.getMyServices(params);
      if (res.success) {
        setState({
          loading: false,
          error: "",
          items: res.services || [],
          pagination: res.pagination || { page: 1, totalPages: 1, total: 0 },
        });
      } else {
        setState({
          loading: false,
          error: res.message || "Gagal memuat layanan",
          items: [],
          pagination: { page: 1, totalPages: 1, total: 0 },
        });
      }
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e.message || "Gagal memuat layanan",
      }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(svc) {
    const ok = window.confirm(`Hapus layanan "${svc.judul}"?`);
    if (!ok) return;
    const res = await serviceService.deleteService(svc.id);
    if (!res.success) {
      alert(res.message || "Gagal menghapus layanan");
      return;
    }
    await load();
  }

  const { loading, error, items, pagination } = state;

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">
          Daftar Layanan
        </h2>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-40 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-200" />
              </div>
              <div className="mb-3 h-36 w-full animate-pulse rounded bg-neutral-200" />
              <div className="mb-2 h-3 w-5/6 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <div className="mt-2">
            <Button variant="outline" onClick={load}>
              Coba lagi
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
          Belum ada layanan. Klik “Tambah Layanan” untuk membuat layanan baru.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((svc) => (
              <MyServiceCard key={svc.id} svc={svc} onDelete={handleDelete} />
            ))}
          </div>

          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            onChange={(p) => setPage(p)}
          />
        </>
      )}
    </section>
  );
}
