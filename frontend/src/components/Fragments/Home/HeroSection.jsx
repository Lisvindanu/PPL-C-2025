import TextRotator from "./TextRotator";
import SearchBarLanding from "./SearchBarLanding";
import { motion } from "framer-motion";

export default function HeroSection({ onSearch }) {
  return (
    <section className="relative min-h-[660px] bg-gradient-to-b from-[#4782BE] to-[#1D375B] flex items-center justify-center px-4 py-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-medium mb-6">
            Kami memiliki profesional freelancer
          </h1>

          {/* Animated Headline */}
          <div className="mb-8">
            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
              <TextRotator />
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Siap untuk mengubah ide anda menjadi kenyataan
          </p>

          {/* Search Bar */}
          <SearchBarLanding onSearch={onSearch} />
        </motion.div>
      </div>
    </section>
  );
}
