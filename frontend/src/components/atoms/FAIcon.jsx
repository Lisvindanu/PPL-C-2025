export default function FAIcon({ icon, className = "", size = "text-2xl" }) {
  return <i className={`fas ${icon} ${size} ${className}`} />;
}
