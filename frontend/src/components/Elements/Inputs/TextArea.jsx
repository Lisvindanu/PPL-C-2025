export default function TextArea({ 
  value, 
  onChange, 
  placeholder = "", 
  rows = 4,
  className = "", 
  ...props 
}) {
  return (
    <textarea 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  )
}
