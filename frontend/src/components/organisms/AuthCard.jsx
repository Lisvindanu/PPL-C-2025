export default function AuthCard({ title, children, footer, headerRight }) {
  return (
    <div className="w-full max-w-md bg-[#f9f7f8] rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#112D4E]">{title}</h1>
        {headerRight && <div>{headerRight}</div>}
      </div>
      {children}
      {footer}
    </div>
  );
}
