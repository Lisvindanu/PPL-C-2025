import { motion } from "framer-motion";

export default function ServiceCardItem({ service, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="flex-shrink-0 w-64 cursor-pointer group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD]">
          <img
            src="/asset/layanan/Layanan.png"
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1D375B]">
              {service.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4782BE] transition-colors">
            {service.title}
          </h3>

          {/* Freelancer Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B]" />
            <span className="text-sm text-neutral-600">{service.freelancer}</span>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-neutral-900">
                {service.rating}
              </span>
              <span className="text-sm text-neutral-500">
                ({service.reviews})
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-500">Mulai dari</div>
              <div className="text-lg font-bold text-[#4782BE]">
                Rp {service.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
