import { useState } from "react";

export default function PasswordInput({ className = "", ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`
          w-full rounded-md 
          bg-[#F9F7F7] 
          text-[#112D4E] 
          text-sm sm:text-base
          placeholder-[#3F72AF]/60 
          px-3 py-2.5 pr-10 sm:px-4 sm:py-3 sm:pr-12 
          border border-[#DBE2EF]
          focus:outline-none 
          focus:ring-2 focus:ring-[#3F72AF]
          transition-colors
        `}
      />
      <button
        type="button"
        className="
          absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 
          text-[#3F72AF] text-xs sm:text-sm font-medium 
          hover:text-[#112D4E] transition-colors
          px-1 py-0.5
        "
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
