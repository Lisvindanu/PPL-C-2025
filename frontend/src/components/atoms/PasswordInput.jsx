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
          placeholder-[#3F72AF]/60 
          px-4 py-3 pr-12 
          border border-[#DBE2EF]
          focus:outline-none 
          focus:ring-2 focus:ring-[#3F72AF]
        `}
      />
      <button
        type="button"
        className="
          absolute right-3 top-1/2 -translate-y-1/2 
          text-[#3F72AF] text-sm font-medium 
          hover:text-[#112D4E] transition-colors
        "
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
