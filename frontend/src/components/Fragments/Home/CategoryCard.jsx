import { motion } from "framer-motion";
import FAIcon from "../../Elements/Icons/FAIcon";

export default function CategoryCard({ title, icon, gradient, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: gradient || "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
        }}
      >
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-black/20 group-hover:from-white/5 group-hover:to-black/30 transition-all duration-500" />

        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-5 text-center">
        {/* Icon Container */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
            <FAIcon icon={icon} className="text-white" size="text-2xl" />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
          {title}
        </h3>
      </div>

      {/* Border highlight */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/30 transition-colors duration-300" />
    </motion.div>
  );
}
