export default function ResetPasswordLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#DBE2EF] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Skill Connect Logo" className="h-10 object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">{children}</div>

      {/* Bottom */}
      {bottom && <div className="py-6 flex items-center justify-center">{bottom}</div>}
    </div>
  );
}
