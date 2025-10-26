export default function AuthLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#DBE2EF] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Skill Connect Logo" className="w-24 md:w-32 lg:w-40 h-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden gap-6">
        {children}

        {/* Bottom */}
        {bottom && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-md">{bottom}</div>
          </div>
        )}
      </div>
    </div>
  );
}
