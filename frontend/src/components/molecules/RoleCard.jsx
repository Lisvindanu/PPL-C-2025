export default function RoleCard({ title, description, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-lg border transition-all ${
        selected 
          ? 'bg-[#F9F7F8] border-[#1B1B1B]' 
          : 'bg-[#F9F7F8] border-transparent hover:border-[#1B1B1B]/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        {icon}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected ? 'bg-[#DBE2EF] border-[#DBE2EF]' : 'border-[#DBE2EF]'
          }`}
        >
          {selected && <div className="w-3 h-3 bg-white rounded-full transition-all duration-200" />}
        </div>
      </div>
      <div className="text-[#1B1B1B] font-title">{title}</div>
      <div className="text-[#1B1B1B] text-sm mt-1">{description}</div>
    </button>
  )
}