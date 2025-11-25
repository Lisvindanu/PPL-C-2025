export default function Label({ children, className = "", ...props }) {
  return (
    <label
      className={`
        block text-xs sm:text-sm font-title font-medium
        text-[#112D4E] 
        mb-1.5 sm:mb-2 tracking-wide
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}
