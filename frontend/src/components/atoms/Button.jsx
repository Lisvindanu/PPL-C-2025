export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#B5ABA0] text-white hover:opacity-90',
    outline: 'border border-[#1B1B1B] text-[#1B1B1B] hover:bg-[#C7B9A7]/10',
    neutral: 'bg-[#B3B3B3] text-white hover:opacity-90',
    role: 'bg-[#FDFCF2] text-[#1B1B1B] hover:opacity-90 border border-transparent hover:border-[#D8CCBC]'
  }
  return (
    <button type={type} className={`px-6 py-3 rounded-full font-medium transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}


