import { useState } from "react";

export default function PasswordInput({ className = "", ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input {...props} type={show ? "text" : "password"} className={`w-full rounded-md bg-[#F5F0EB] text-[#2E2A28] placeholder-[#9C8C84] px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#696969] border border-[#B3B3B3]`} />
      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6961] text-sm underline" onClick={() => setShow((s) => !s)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
