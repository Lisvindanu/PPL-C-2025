export default function Select({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Pilih...",
  className = "", 
  ...props 
}) {
  return (
    <select 
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
