/** "17:30" -> "5:30 PM" (el admin guarda la hora como texto libre, p. ej. "5:00 PM"). */
export function to12h(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m) return ''
  const h = Number(m[1])
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m[2]} ${suffix}`
}

/** "5:30 PM" -> "17:30" para el input type="time". Si no se reconoce, cadena vacía. */
export function to24h(text: string): string {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(text.trim())
  if (!m) return /^\d{2}:\d{2}$/.test(text.trim()) ? text.trim() : ''
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}
