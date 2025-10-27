export default function AuthCard({ title, children, footer }) {
  return (
    <div className="w-full max-w-md bg-[#FFFFFF] rounded-lg shadow-lg p-8 border border-[#9DBBDD]">
      <h1 className="text-2xl text-center font-semibold text-[#1D375B] mb-6">{title}</h1>
      {children}
      {footer}
    </div>
  )
}
