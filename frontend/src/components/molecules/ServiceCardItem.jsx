import { motion } from "framer-motion";
import { useState } from "react";

export default function ServiceCardItem({ service, onClick }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

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
        <div className="relative p-4 bg-gradient-to-br from-[#4782BE] to-[#1D375B]">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-[#D8E3F3] transition-colors">
            {service.title}
          </h3>

          {/* Freelancer Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm" />
            <span className="text-sm text-white/90">{service.freelancer}</span>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-white">
                {service.rating}
              </span>
              <span className="text-sm text-white/80">
                ({service.reviews})
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/80">Mulai dari</div>
              <div className="text-lg font-bold text-white">
                Rp {service.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={handleLikeClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Like"
            >
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-white text-sm`} />
            </button>
            <button
              onClick={handleBookmarkClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Bookmark"
            >
              <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark text-white text-sm`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
