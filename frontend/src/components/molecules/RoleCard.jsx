export default function RoleCard({ title, description, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-lg border transition-all ${
        selected 
          ? 'bg-[#5C0C19] border-[#D8CCBC]' 
          : 'bg-[#5C0C19] border-transparent hover:border-[#D8CCBC]/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 bg-[#D8CCBC] rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className={`w-4 h-4 rounded-full border-2 ${
          selected ? 'bg-[#D8CCBC] border-[#D8CCBC]' : 'border-[#D8CCBC]'
        }`} />
      </div>
      <div className="text-[#D8CCBC] font-medium">{title}</div>
      <div className="text-[#D8CCBC]/80 text-sm mt-1">{description}</div>
    </button>
  )
}
