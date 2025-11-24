import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import Pagination from "../atoms/Pagination";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ResultModal from "./ResultModal";
import { useMyServices, useDeleteService } from "../../hooks/useMyServices";

export default function BlockListSection() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const navigate = useNavigate();

  const { data, isLoading, isError } = useMyServices({ page, limit });
  const services = data?.services ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1 };

  // modal states
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState({ open: false, ok: true, msg: "" });

  // mutation
  const { mutateAsync: deleteService, isLoading: isDeleting } =
    useDeleteService();

  const askDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteService(selectedId);
      setConfirmOpen(false);
      setResult({
        open: true,
        ok: true,
        msg: "Layanan berhasil dihapus (status diset Nonaktif).",
      });
    } catch (e) {
      setConfirmOpen(false);
      setResult({
        open: true,
        ok: false,
        msg: e?.message || "Gagal menghapus layanan.",
      });
    } finally {
      setSelectedId(null);
    }
  };

  // handler edit → redirect ke halaman Edit Layanan
  const handleEdit = (service) => {
    if (!service?.id) return;
    navigate(`/freelance/service/${service.id}/edit`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Daftar Layanan
      </h2>

      {isError ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Gagal memuat data layanan.
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <ServiceCard
                key={item.id}
                item={item}
                onEdit={handleEdit} // ⬅️ EDIT DI SINI
                onDelete={() => askDelete(item.id)}
                disabledActions={isDeleting}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            onChange={setPage}
          />
        </>
      )}

      {/* Confirm */}
      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => {
          if (!isDeleting) setConfirmOpen(false);
        }}
        onConfirm={doDelete}
        loading={isDeleting}
      />

      {/* Result */}
      <ResultModal
        open={result.open}
        onClose={() => setResult((r) => ({ ...r, open: false }))}
        title={result.ok ? "Berhasil Dihapus" : "Gagal Menghapus"}
        description={result.msg}
        variant={result.ok ? "success" : "error"}
      />
    </section>
  );
}
