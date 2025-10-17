export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-md bg-[#E2D6C7] text-[#3A2B2A] placeholder-[#927E78] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C7B9A7] border-0 ${className}`}
      {...props}
    />
  )
}


