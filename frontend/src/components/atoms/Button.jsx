export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#4782BE] text-white hover:bg-[#9DBBDD]',
    outline: 'border-2 border-[#4782BE] text-[#1D375B] hover:bg-[#D8E3F3]',
    neutral: 'bg-[#9DBBDD] text-white hover:bg-[#4782BE]',
    role: 'bg-[#FFFFFF] text-[#1D375B] hover:bg-[#D8E3F3] border-2 border-[#9DBBDD] hover:border-[#4782BE]'
  }
  return (
    <button type={type} className={`px-6 py-3 rounded-full font-medium transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}


