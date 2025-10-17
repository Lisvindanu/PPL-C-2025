export default function AuthLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#4B0713] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#4B0713] rounded-full"></div>
          </div>
          <span className="text-white text-lg font-medium">Skill Connect</span>
        </div>
        {title && <span className="text-white text-sm">{title}</span>}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* corner shape */}
        {showCorner && (
          <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#E2D6C7] rounded-full opacity-90" />
        )}
        {children}
      </div>

      {/* Bottom */}
      {bottom && (
        <div className="py-6 flex items-center justify-center">
          {bottom}
        </div>
      )}
    </div>
  )
}


