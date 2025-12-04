import Modal from "../../Elements/Common/Modal";
import { HandHelping, Settings } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="p-6 sm:p-8">
        {/* Icon kombinasi lucide: hand-helping + settings */}
        <div className="mb-4 flex items-center justify-center">
          <div className="relative h-14 w-14 text-[#3B82F6]">
            {/* Tangan */}
            <HandHelping
              className="absolute left-1 top-5 h-10 w-10"
              strokeWidth={2}
            />
            {/* Gear kecil di atas kanan */}
            <Settings
              className="absolute right-0 top-0 h-6 w-6"
              strokeWidth={2}
            />
          </div>
        </div>

        <h3 className="text-center text-xl font-bold text-neutral-900 sm:text-2xl">
          Apakah anda yakin ingin
          <br /> menghapus layanan ini?
        </h3>

        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-8">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-white shadow hover:bg-red-700 disabled:opacity-60"
          >
            Membatalkan
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-[#3B82F6] px-4 py-2.5 text-white shadow hover:bg-blue-600 disabled:opacity-60"
          >
            {loading ? "Menghapus..." : "Hapus Layanan"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
