export default function Logo({ size = "md", className = "", ...props }) {
  const sizes = {
    sm: {
      container: "gap-1 p-2",
      text: "text-lg"
    },
    md: {
      container: "gap-2 p-4",
      text: "text-xl"
    },
    lg: {
      container: "gap-3 p-6",
      text: "text-2xl"
    },
    xl: {
      container: "gap-4 p-8",
      text: "text-3xl"
    }
  }

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center justify-center ${currentSize.container} ${className}`} {...props}>
      <div className={`text-skill-secondary font-bold ${currentSize.text} leading-tight`}>
        Skill Connect
      </div>
    </div>
  );
}