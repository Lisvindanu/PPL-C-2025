import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Gaya Hidup",
  "Teknologi",
  "Bisnis",
  "Kreatif",
  "Digital",
  "Profesional",
];

export default function TextRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-block min-w-[280px] text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
