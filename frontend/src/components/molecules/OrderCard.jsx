import { motion } from "framer-motion";

export default function OrderCard({ order, onRate }) {
  const hasRating = order.rated && order.rating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-neutral-300 rounded-3xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-6">
        {/* Image */}
        <div className="flex-shrink-0 w-48 h-36 bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] rounded-2xl overflow-hidden">
          <img
            src={order.serviceImage || "/asset/layanan/Layanan.png"}
            alt={order.serviceName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Title and Freelancer */}
          <h3 className="text-xl font-bold text-neutral-900 mb-1">
            {order.serviceName}
          </h3>
          <p className="text-neutral-600 mb-3">{order.freelancerName}</p>

          {/* Details */}
          <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <i className="far fa-calendar text-neutral-500" />
              <span>Tanggal Selesai: {order.deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-folder text-neutral-500" />
              <span>Kategori: {order.category}</span>
            </div>
          </div>

          {/* Bottom Section: Price and Rating/Button */}
          <div className="mt-auto flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-600">Harga</div>
              <div className="text-2xl font-bold text-[#4782BE]">
                Rp {order.price.toLocaleString("id-ID")}
              </div>
            </div>

            {hasRating ? (
              /* Rating Display */
              <div className="text-right">
                <div className="text-sm text-neutral-600 mb-1">Rating telah tersimpan</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star text-lg ${
                        star <= order.rating ? "text-yellow-400" : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Rate Button */
              <button
                onClick={() => onRate(order)}
                className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Beri Rating
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
