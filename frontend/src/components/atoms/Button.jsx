export default function Button({ children, type = 'button', variant = 'primary', className = '', icon, ...props }) {
  const variants = {
    primary: 'bg-[#B5ABA0] text-white hover:opacity-90',
    outline: 'border border-[#1B1B1B] text-[#1B1B1B] hover:bg-[#C7B9A7]/10',
    neutral: 'bg-[#B3B3B3] text-white hover:bg-[#112D4E]',
    role: 'bg-[#F9F7F8] text-[#1B1B1B] hover:opacity-90 border border-transparent hover:border-[#112D4E]'
  }
  return (
    <button 
      type={type} 
      className={`px-6 py-3 rounded-full font-medium transition inline-flex items-center justify-center gap-2 ${variants[variant]} ${className}`} 
      {...props}
    >
      {icon && icon}
      <span>{children}</span>
    </button>
  )
}