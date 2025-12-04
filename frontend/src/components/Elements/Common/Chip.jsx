export default function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 text-xs px-3 py-1 ${className}`}
    >
      {children}
    </span>
  );
}
