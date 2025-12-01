export default function Logo({ size = "md", className = "", ...props }) {
  const sizes = {
    sm: "w-16 md:w-20 lg:w-24",
    md: "w-24 md:w-32 lg:w-40",
    lg: "w-32 md:w-40 lg:w-48",
    xl: "w-40 md:w-48 lg:w-56"
  }

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <img
        src="/assets/logo.png"
        alt="Skill Connect Logo"
        className={`${currentSize} h-auto`}
      />
    </div>
  );
}