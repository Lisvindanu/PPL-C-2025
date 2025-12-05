export default function AuthCard({ title, children, footer, headerRight }) {
  return (
    <div className="w-full bg-[#f9f7f8] rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-6 sm:p-8 md:p-10">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#112D4E] leading-tight">{title}</h1>
        {headerRight && <div className="ml-4">{headerRight}</div>}
      </div>
      <div className="space-y-4 sm:space-y-5">{children}</div>
      {footer && <div className="mt-6 sm:mt-8">{footer}</div>}
    </div>
  );
}
