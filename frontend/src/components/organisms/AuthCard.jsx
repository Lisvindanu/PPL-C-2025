export default function AuthCard({ title, children, footer }) {
  return (
    <div className="w-full max-w-md bg-[#D8CCBC] rounded-lg shadow-md p-8">
      <h1 className="text-2xl text-center font-semibold text-[#3A2B2A] mb-6">{title}</h1>
      {children}
      {footer}
    </div>
  )
}


