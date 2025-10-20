export default function ResetPasswordCard({ title, children, footer, hasHeader = false }) {
  return (
    <div className={`w-full bg-white shadow-md p-8 ${hasHeader ? 'rounded-b-lg' : 'rounded-lg'}`}>
      <h1 className="text-2xl text-center font-semibold text-[#2E2A28] mb-6">{title}</h1>
      {children}
      {footer}
    </div>
  )
}
