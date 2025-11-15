export default function Button({ children, type = "button", variant = "primary", className = "", icon, ...props }) {
  const variants = {
    primary: "bg-[#4782BE] text-white hover:bg-[#9DBBDD]",
    outline: "border-2 border-[#4782BE] text-[#1D375B] hover:bg-[#D8E3F3]",
    neutral: "bg-[#B3B3B3] text-white hover:bg-[#4782BE]",
    role: "bg-[#FFFFFF] text-[#1D375B] hover:bg-[#D8E3F3] border-2 border-[#9DBBDD] hover:border-[#4782BE]",
  };

  return (
    <button type={type} className={`px-6 py-3 rounded-full font-medium transition inline-flex items-center justify-center gap-2 ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
