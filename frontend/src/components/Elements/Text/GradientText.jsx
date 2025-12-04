export default function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent font-bold ${className}`}
    >
      {children}
    </span>
  );
}
