export default function SearchButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-gradient-to-r from-[#4782BE] to-[#1D375B] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
}
