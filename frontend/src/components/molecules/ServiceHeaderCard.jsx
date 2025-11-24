import { useState } from "react";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";

export default function ServiceHeaderCard({
  avatar,
  name,
  rating = 0,
  reviewCount = 0,
  images = [],
}) {
  const [index, setIndex] = useState(0);

  function prev() {
    if (images.length === 0) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    if (images.length === 0) return;
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} size="sm" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">{name}</p>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <StarRating value={rating} />
              <span>{(parseFloat(rating) || 0).toFixed(1)}</span>
              <span>•</span>
              <span>{reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {images.length > 0 ? (
          <img
            src={images[index]}
            alt={`Gambar ${index + 1}`}
            className="w-full h-64 sm:h-80 object-cover"
          />
        ) : (
          <div className="h-64 sm:h-80 flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Prev"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-4 rounded-full ${
                  i === index ? "bg-white" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
