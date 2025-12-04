export default function SelectBox({
  children,
  leftIcon,
  className = "",
  ...props
}) {
  const base =
    "w-full rounded-xl border border-[#E5D5CC] bg-[#F5F0EB] px-3 py-2 text-sm " +
    "text-[#3E2723] placeholder:text-[#B29A8F] focus:outline-none " +
    "focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0";

  return (
    <div className="relative flex items-center">
      {leftIcon && (
        <div className="pointer-events-none absolute left-3 text-[#9C8C84]">
          {leftIcon}
        </div>
      )}

      <select
        className={`${base} ${
          leftIcon ? "pl-10" : ""
        } appearance-none pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>

      {/* 1 ikon dropdown custom di kanan */}
      <span className="pointer-events-none absolute right-3 text-xs text-[#9C8C84]">
        ▾
      </span>
    </div>
  );
}
