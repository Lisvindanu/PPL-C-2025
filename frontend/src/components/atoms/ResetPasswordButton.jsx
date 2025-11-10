export default function ResetPasswordButton({ children, type = 'button', className = '', ...props }) {
  return (
    <button 
      type={type} 
      className={`w-full px-6 py-3 rounded-md font-medium transition bg-[#B3B3B3] text-white hover:opacity-90 ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
