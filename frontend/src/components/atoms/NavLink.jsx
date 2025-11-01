export default function NavLink({ active, className = "", ...rest }) {
  return (
    <a
      {...rest}
      className={`px-2 py-2 text-sm whitespace-nowrap ${
        active
          ? "text-black font-semibold"
          : "text-neutral-700 hover:text-black"
      } ${className}`}
    />
  );
}
