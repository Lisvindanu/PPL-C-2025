import Button from '../atoms/Button'

export default function EditForm({ 
  isEditing, 
  loading, 
  onSave, 
  onCancel 
}) {
  if (!isEditing) return null

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button variant="neutral" onClick={onSave} disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </div>
  )
}
