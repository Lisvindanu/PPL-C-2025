import { motion, AnimatePresence } from "framer-motion";

export default function OrderConfirmModal({ isOpen, onClose, onConfirm, orderData }) {
  if (!orderData) return null;

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
              {/* Header */}
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Konfirmasi Pesanan
                </h2>
                <p className="text-neutral-600 text-sm mt-1">
                  Pastikan detail pesanan Anda sudah benar
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Layanan</div>
                  <div className="font-semibold text-neutral-900">{orderData.serviceName}</div>
                </div>

                <div>
                  <div className="text-sm text-neutral-600 mb-1">Paket</div>
                  <div className="font-semibold text-neutral-900">{orderData.package}</div>
                </div>

                <div>
                  <div className="text-sm text-neutral-600 mb-1">Freelancer</div>
                  <div className="font-semibold text-neutral-900">{orderData.freelancerName}</div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-600">Total Harga</div>
                    <div className="text-2xl font-bold text-[#4782BE]">
                      Rp {orderData.price?.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-200 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-neutral-100 text-neutral-700 font-semibold py-3 rounded-full hover:bg-neutral-200 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white font-semibold py-3 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  Konfirmasi Pesanan
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
