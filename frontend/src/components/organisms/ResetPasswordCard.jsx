export default function ResetPasswordCard({ title, children, footer, hasHeader = false }) {
  return (
    <div className={`w-full bg-[#F9F7F7] shadow-md p-8 ${hasHeader ? 'rounded-b-lg' : 'rounded-lg'}`}>
      <h1 className="text-2xl text-center font-semibold font-title text-[#112D4E] mb-6">{title}</h1>
      {children}
      {footer}
    </div>
  )
}
