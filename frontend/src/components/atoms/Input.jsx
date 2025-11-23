export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`
        w-full rounded-md 
        bg-[#F9F7F7] 
        text-[#112D4E] 
        text-sm sm:text-base
        placeholder-[#3F72AF]/60 
        px-3 py-2.5 sm:px-4 sm:py-3 
        border border-[#DBE2EF] 
        focus:outline-none 
        focus:ring-2 focus:ring-[#3F72AF] 
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}
