export default function ResetPasswordInput({ className = "", ...props }) {
  return <input className={`w-full rounded-md bg-white text-[#2E2A28] placeholder-[#9C8C84] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#696969] border border-[#B3B3B3] ${className}`} {...props} />;
}
