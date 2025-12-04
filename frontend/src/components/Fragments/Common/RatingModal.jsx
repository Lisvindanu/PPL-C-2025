import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-neutral-700 font-medium">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <i
              className={`fas fa-star text-2xl ${
                star <= (hover || value) ? "text-yellow-400" : "text-neutral-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatingModal({ isOpen, onClose, order, onSubmit }) {
  const [ratings, setRatings] = useState({
    quality: 0,
    communication: 0,
    punctuality: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    // Validate all ratings are filled
    if (ratings.quality === 0 || ratings.communication === 0 || ratings.punctuality === 0) {
      alert("Mohon lengkapi semua rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate average rating
      const averageRating = (ratings.quality + ratings.communication + ratings.punctuality) / 3;

      await onSubmit({
        orderId: order.id,
        ratings,
        averageRating,
        feedback,
      });

      // Reset form
      setRatings({ quality: 0, communication: 0, punctuality: 0 });
      setFeedback("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Gagal mengirim rating. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

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
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between mb-4">
                  <img
                    src="/LogoSkillConnect.png"
                    alt="SkillConnect"
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <i className="fas fa-times text-xl" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Berikan Ulasan untuk Freelancer Anda
                </h2>
                <p className="text-neutral-600 text-sm mt-1">
                  Bantu freelancer ini membangun reputasinya dengan memberikan umpan balik.
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Freelancer Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-[#D8E3F3]/30 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B] flex items-center justify-center">
                    <i className="fas fa-user text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-neutral-900">{order.freelancerName}</h3>
                    <p className="text-sm text-neutral-600">{order.freelancerTitle}</p>
                  </div>
                </div>

                {/* Service Title */}
                <div className="mb-6">
                  <h4 className="font-bold text-neutral-900 text-lg mb-2">{order.serviceName}</h4>
                </div>

                {/* Rating Categories */}
                <div className="mb-6">
                  <StarRating
                    label="Kualitas pekerjaan"
                    value={ratings.quality}
                    onChange={(value) => handleRatingChange("quality", value)}
                  />
                  <StarRating
                    label="Komunikasi"
                    value={ratings.communication}
                    onChange={(value) => handleRatingChange("communication", value)}
                  />
                  <StarRating
                    label="Ketaatan terhadap batas waktu"
                    value={ratings.punctuality}
                    onChange={(value) => handleRatingChange("punctuality", value)}
                  />
                </div>

                {/* Feedback Textarea */}
                <div className="mb-6">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Jelaskan pengalaman Anda bekerja dengan freelancer ini."
                    className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent bg-[#D8E3F3]/10"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    "Kirim Ulasan"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
