import TextField from '../../Elements/Inputs/TextField'

export default function SkillTag({ 
  skill, 
  isEditing, 
  onSkillChange, 
  onRemove 
}) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        <TextField 
          value={skill}
          onChange={(e) => onSkillChange(e.target.value)}
          className="bg-transparent border-none outline-none text-blue-800 text-sm flex-1"
          variant="default"
        />
        <button 
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 ml-1"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
      {skill}
    </span>
  )
}
