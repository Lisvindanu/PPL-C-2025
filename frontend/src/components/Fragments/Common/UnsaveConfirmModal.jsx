import { motion, AnimatePresence } from "framer-motion";

export default function UnsaveConfirmModal({ isOpen, onClose, onConfirm, serviceName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            >
              {/* Icon */}
              <div className="pt-8 pb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-bookmark text-blue-500 text-3xl" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Hapus dari Disimpan?
                </h2>
                <p className="text-neutral-600 mb-1">
                  Apakah Anda yakin ingin menghapus layanan ini dari daftar simpanan?
                </p>
                <p className="text-sm text-neutral-500 font-semibold">
                  {serviceName}
                </p>
              </div>

              {/* Buttons */}
              <div className="p-6 border-t border-neutral-200 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-neutral-100 text-neutral-700 font-semibold py-3 rounded-full hover:bg-neutral-200 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
