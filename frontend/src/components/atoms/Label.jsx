export default function Label({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm text-[#6C5A55] mb-2 ${className}`} {...props}>
      {children}
    </label>
  )
}


