export default function ResetPasswordLabel({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm text-[#112D4E] mb-2 font-medium font-title ${className}`} {...props}>
      {children}
    </label>
  )
}
