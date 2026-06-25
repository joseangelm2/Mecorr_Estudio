import type { Invitado } from '@/types/invitation'

/** Construye la URL wa.me para enviar la invitación personalizada al invitado. */
export function buildWhatsAppUrl(invitado: Invitado, festejada: string, slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://invitaxv.lol'
  const url = `${base}/i/${slug}/invitacion?token=${invitado.token}`

  const msg = encodeURIComponent(
    `¡Hola ${invitado.titular}! 🌸 Estás invitado/a a los XV años de ${festejada}.\n` +
    `Confirma tu asistencia aquí:\n${url}`
  )

  const phone = invitado.whatsapp?.replace(/\D/g, '') ?? ''
  return `https://wa.me/${phone}?text=${msg}`
}

/** Construye la URL wa.me de notificación al admin cuando un invitado confirma. */
export function buildAdminNotifUrl(
  adminPhone: string,
  titular: string,
  confirmacion: 'SI' | 'NO',
  festejada: string,
  mensaje?: string | null
): string {
  let text = `${titular} confirmó ${confirmacion === 'SI' ? '✅ que SÍ asistirá' : '❌ que NO asistirá'} a los XV de ${festejada}.`
  if (mensaje) text += `\n\n💬 Mensaje: "${mensaje}"`

  const phone = adminPhone.replace(/\D/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
