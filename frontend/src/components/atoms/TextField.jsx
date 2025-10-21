export default function TextField({ 
  value, 
  onChange, 
  placeholder = "", 
  type = "text", 
  variant = "default",
  className = "", 
  ...props 
}) {
  const variants = {
    default: "border-b border-gray-300 focus:border-blue-500 focus:outline-none",
    filled: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  }

  return (
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  )
}
