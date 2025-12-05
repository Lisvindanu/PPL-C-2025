export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  icon,
  ...props
}) {
  const variants = {
    primary: "bg-[#4782BE] text-white hover:bg-[#9DBBDD] active:bg-[#4782BE]",
    outline: "border-2 border-[#4782BE] text-[#1D375B] hover:bg-[#D8E3F3] active:bg-[#9DBBDD]",
    neutral: "bg-[#B3B3B3] text-white hover:bg-[#4782BE] active:bg-[#4782BE]",
    role: "bg-[#FFFFFF] text-[#1D375B] hover:bg-[#D8E3F3] border-2 border-[#9DBBDD] hover:border-[#4782BE] active:bg-[#D8E3F3]",
    order:
      "bg-[#102d4f] text-white rounded-xl hover:bg-[#f3f4f6] hover:text-[#102d4f] active:bg-[#f3f4f6]",
    create:
      "bg-[#102d4f] text-white rounded-lg hover:bg-[#4782BE] hover:text-white active:bg-[#4782BE]",
    cancel:
      "rounded-lg border-2 border-red-500 text-[#1D375B] hover:bg-red-500 hover:text-white active:bg-red-500",
  };

  return (
    <button
      type={type}
      className={`
        px-4 py-2.5 sm:px-6 sm:py-3
        rounded-full
        font-medium
        text-sm sm:text-base
        transition-all duration-200
        inline-flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
