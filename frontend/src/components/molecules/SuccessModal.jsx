import { motion, AnimatePresence } from "framer-motion";

export default function SuccessModal({ isOpen, onClose, message = "Berhasil!" }) {
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
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              {/* Success Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-500 text-4xl" />
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Ulasan telah berhasil dikirim
              </h2>
              <p className="text-neutral-600 mb-8">{message}</p>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-[#D8E3F3] text-[#1D375B] font-semibold py-3 rounded-full hover:bg-[#4782BE]/20 transition-all duration-300"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
