import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function FavoriteToast({ isOpen, onClose, isFavorite }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto close after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl p-6 text-center max-w-sm w-full pointer-events-auto"
          >
            {/* Icon */}
            <div className="mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isFavorite ? 'bg-green-100' : 'bg-neutral-100'
              }`}>
                <i className={`${isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart text-neutral-400'} text-3xl`} />
              </div>
            </div>

            {/* Message */}
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              {isFavorite ? 'Ditambahkan ke Favorit' : 'Dihapus dari Favorit'}
            </h3>
            <p className="text-sm text-neutral-600">
              {isFavorite
                ? 'Layanan berhasil ditambahkan ke daftar favorit Anda'
                : 'Layanan berhasil dihapus dari daftar favorit Anda'
              }
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-4 w-full bg-[#D8E3F3] text-[#1D375B] font-semibold py-2 rounded-full hover:bg-[#4782BE]/20 transition-all duration-300"
            >
              Tutup
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
