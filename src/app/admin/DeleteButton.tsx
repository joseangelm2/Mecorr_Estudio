'use client'

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50 text-red-500"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm('¿Eliminar este proyecto?')) e.preventDefault()
      }}
    >
      Eliminar
    </button>
  )
}
