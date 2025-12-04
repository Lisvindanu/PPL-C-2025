export default function AuthLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#D8E3F3] flex flex-col lg:flex-row">
      {/* Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/assets/logo.png" alt="Skill Connect Logo" className="h-14 w-auto sm:h-20 md:h-24 object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center lg:pl-12 lg:pr-8">
        <img src="/assets/logo.png" alt="Skill Connect Logo" className="h-40 w-auto xl:h-48 object-contain" />
      </div>

      {/* Right Section - Forms */}
      <div className="flex-1 flex flex-col lg:justify-center lg:items-center lg:px-8 lg:py-8">
        {/* Main Content - Forms */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-6 lg:py-0 lg:px-0">
          <div className="w-full max-w-full sm:max-w-lg lg:max-w-md">
            {/* Login Card */}
            <div>{children}</div>

            {/* Registration Card */}
            {bottom && <div className="mt-3 sm:mt-4">{bottom}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
