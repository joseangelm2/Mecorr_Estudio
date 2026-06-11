'use client'

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-xs px-2.5 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500 font-medium transition-colors"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm('¿Eliminar esta invitación? Esta acción no se puede deshacer.')) e.preventDefault()
      }}
    >
      Eliminar
    </button>
  )
}
