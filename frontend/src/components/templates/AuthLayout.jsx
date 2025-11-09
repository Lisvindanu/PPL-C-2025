export default function AuthLayout({ children, bottom, title, showCorner = true }) {
  return (
    <div className="min-h-screen bg-[#D8E3F3] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <img src="/LogoSkillConnect.png" alt="Skill Connect Logo" className="h-10 object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">{children}</div>

      {/* Bottom */}
      <div className="pb-8 pt-4 flex items-center justify-center">{bottom}</div>
    </div>
  );
}
