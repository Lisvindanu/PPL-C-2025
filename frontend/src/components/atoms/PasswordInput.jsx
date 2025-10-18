import { useState } from 'react'

export default function PasswordInput({ className = '', ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`w-full rounded-md bg-[#E2D6C7] text-[#3A2B2A] placeholder-[#927E78] px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C7B9A7] border-0`}
      />
      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C5A55] text-sm underline" onClick={() => setShow((s) => !s)}>
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}


