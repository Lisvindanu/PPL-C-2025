import Icon from "./Icon";

export default function SelectBox({ leftIcon = null, className = "", children, ...props }) {
  return (
    <div className={"relative " + className}>
      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8C84]">
          {leftIcon}
        </span>
      ) : null}

      <select
        className={
          "w-full rounded-md bg-[#F5F0EB] text-[#2E2A28] placeholder-[#9C8C84] border border-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#696969] " +
          (leftIcon ? "pl-9 pr-9 py-3" : "px-4 pr-9 py-3")
        }
        {...props}
      >
        {children}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8C84]">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
