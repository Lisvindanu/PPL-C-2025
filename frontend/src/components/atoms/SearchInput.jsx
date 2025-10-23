export default function SearchInput({ className = "", ...rest }) {
  return (
    <input
      type="search"
      placeholder="Search here..."
      className={
        "w-full rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-2 placeholder:text-neutral-400 focus:border-[#B5ABA0] focus:outline-none focus:ring-2 focus:ring-[#B5ABA0]/30 " +
        className
      }
      {...rest}
    />
  );
}
