export default function Spinner({ size = 24, color = '#C7B9A7' }) {
  const border = Math.max(2, Math.round(size / 8))
  return (
    <div
      style={{
        width: size,
        height: size,
        borderWidth: border,
        borderColor: `${color}40`,
        borderTopColor: color
      }}
      className="rounded-full animate-spin border-solid"
    />
  )
}


