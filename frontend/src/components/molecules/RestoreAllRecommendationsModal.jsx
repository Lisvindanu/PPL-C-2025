export default function RestoreAllRecommendationsModal({ isOpen, onClose, onConfirm, count }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="fas fa-redo text-3xl text-[#4782BE]"></i>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">
          Tampilkan Semua Rekomendasi?
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-center mb-6">
          Semua <span className="font-semibold text-neutral-900">{count} rekomendasi</span> yang disembunyikan akan ditampilkan kembali di beranda Anda.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-lg bg-[#4782BE] text-white font-semibold hover:bg-[#1D375B] transition-colors shadow-lg"
          >
            Ya, Tampilkan Semua
          </button>
        </div>
      </div>
    </div>
  );
}
