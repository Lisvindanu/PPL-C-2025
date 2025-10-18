export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#B5ABA0] text-white hover:opacity-90',
    outline: 'border border-[#C7B9A7] text-[#C7B9A7] hover:bg-[#C7B9A7]/10',
    neutral: 'bg-[#B5ABA0] text-white hover:opacity-90',
    role: 'bg-[#5C0C19] text-[#D8CCBC] hover:opacity-90 border border-transparent hover:border-[#D8CCBC]'
  }
  return (
    <button type={type} className={`px-6 py-3 rounded-lg font-medium transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}


