export default function StarRating({ value = 0, size = "sm", className = "" }) {
  const stars = Math.max(0, Math.min(5, Math.round(value)));
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${sizes[size]} ${
            i < stars ? "text-yellow-400" : "text-neutral-300"
          }`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 15.27l-5.18 3.05 1.64-5.64L1 7.97l5.91-.5L10 2l3.09 5.47 5.91.5-5.46 4.71 1.64 5.64L10 15.27z" />
        </svg>
      ))}
    </div>
  );
}
