import { motion } from "framer-motion";

export default function SearchServiceCardItem({ service, onClick }) {
  const thumbnailSrc = service.thumbnail || "/asset/layanan/Layanan.png";

  return (
    <motion.button
      type="button"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="group h-full w-full cursor-pointer text-left"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow duration-300 group-hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
        {/* Gambar + badge + bookmark */}
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={thumbnailSrc}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge kategori */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.16)]">
              {service.category}
            </span>
          </div>

          {/* Icon bookmark di pojok kanan atas (non-functional / optional) */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_12px_rgba(15,23,42,0.16)]">
            <i className="far fa-bookmark text-sm text-slate-700 group-hover:text-slate-900" />
          </div>
        </div>

        {/* Konten */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          {/* Judul / highlight – kita pakai title sebagai highlight biru */}
          <h3 className="text-sm font-semibold leading-snug text-[#2563EB] line-clamp-1 group-hover:underline">
            {service.category}
          </h3>

          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
            {service.subtitle ||
              "Pembuatan Website Company Profile Modern & Profesional"}
          </p>

          {/* Info freelancer */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-200">
              {service.freelancerAvatar ? (
                <img
                  src={service.freelancerAvatar}
                  alt={service.freelancer}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-semibold text-slate-600">
                  {service.freelancer?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-600">
              {service.freelancer}
            </span>
          </div>

          {/* Harga + rating */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Mulai dari</p>
              <p className="text-sm font-bold text-[#2563EB]">
                Rp {service.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <i className="fas fa-star text-[#FBBF24]" />
              <span className="font-semibold text-slate-900">
                {service.rating}
              </span>
              <span className="text-slate-500">
                ({service.reviews?.toLocaleString("id-ID")})
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
