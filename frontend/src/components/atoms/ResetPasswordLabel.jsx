export default function ResetPasswordLabel({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm text-[#2E2A28] mb-2 font-medium ${className}`} {...props}>
      {children}
    </label>
  )
}
