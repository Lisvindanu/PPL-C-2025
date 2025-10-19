import TextField from '../atoms/TextField'
import Select from '../atoms/Select'

export default function LanguageItem({ 
  language, 
  isEditing, 
  onLanguageChange, 
  onRemove 
}) {
  const levelOptions = [
    { value: 'Dasar', label: 'Dasar' },
    { value: 'Menengah', label: 'Menengah' },
    { value: 'Fasih', label: 'Fasih' },
    { value: 'Native', label: 'Native' }
  ]

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <TextField 
          value={language.name}
          onChange={(e) => onLanguageChange({ ...language, name: e.target.value })}
          className="flex-1"
          placeholder="Bahasa"
          variant="filled"
        />
        <Select 
          value={language.level}
          onChange={(e) => onLanguageChange({ ...language, level: e.target.value })}
          options={levelOptions}
        />
        <button 
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-between">
      <span className="text-gray-700">{language.name}:</span>
      <span className="text-gray-900 font-medium">{language.level}</span>
    </div>
  )
}
