export default function RoleCard({ title, description, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-lg border-2 transition-all ${
        selected
          ? 'bg-[#FFFFFF] border-[#4782BE] shadow-md'
          : 'bg-[#FFFFFF] border-[#9DBBDD] hover:border-[#4782BE] hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 bg-[#4782BE] rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div
  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
    selected ? 'bg-[#4782BE] border-[#4782BE]' : 'border-[#9DBBDD]'
  }`}
>
  {selected && <div className="w-3 h-3 bg-white rounded-full transition-all duration-200" />}
</div>

      </div>
      <div className="text-[#1D375B] font-title font-semibold">{title}</div>
      <div className="text-[#1D375B] text-sm mt-1 opacity-80">{description}</div>
    </button>
  )
}