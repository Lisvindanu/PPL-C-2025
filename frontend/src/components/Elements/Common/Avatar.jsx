export default function Avatar({ src, alt = "Avatar", size = "md", className = "", ...props }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  }

  return (
    <div className={`relative ${sizes[size]} ${className}`} {...props}>
      <img 
        src={src} 
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    </div>
  )
}
