export default function ResetPasswordLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#DBE2EF] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#DBE2EF] rounded-full"></div>
          </div>
          <span className="text-[#1B1B1B] text-lg font-medium font-title">Skill Connect</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">{children}</div>

      {/* Bottom */}
      {bottom && <div className="py-6 flex items-center justify-center">{bottom}</div>}
    </div>
  );
}
