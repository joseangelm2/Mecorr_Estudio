import { ITINERARY_KINDS, isBoda, type ClientData, type ItineraryKind, type SectionId } from './schema'

/**
 * Preguntas y respuestas del formulario del cliente, para el PDF.
 * Las etiquetas replican las de RegistroForm.tsx: si cambias una allá, cámbiala aquí.
 */
export interface QAItem { q: string; a: string }
export interface QASection { id: SectionId; title: string; items: QAItem[] }

const KIND_LABEL: Record<ItineraryKind, string> = {
  ceremonia: 'Ceremonia', recepcion: 'Recepción', coctel: 'Coctel', cena: 'Cena',
  vals: 'Vals', baile: 'Baile', fin: 'Fin del evento', otro: 'Otro',
}
const STORE_LABEL: Record<string, string> = {
  liverpool: 'Liverpool', amazon: 'Amazon', palacio: 'El Palacio de Hierro', sears: 'Sears', generic: 'Otra tienda',
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** "2026-12-12T19:00" -> "12 de diciembre de 2026, 7:00 PM" (sin zonas horarias: es la hora del evento). */
export function formatEventDate(v: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v)
  if (!m) return v
  const h = Number(m[4])
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}, ${h12}:${m[5]} ${h >= 12 ? 'PM' : 'AM'}`
}

const list = (xs: string[]) => xs.map(s => s.trim()).filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join('\n')

export function buildQA(template: string, d: ClientData): QASection[] {
  const boda = isBoda(template)
  const place = (p: ClientData['lugares']['ceremony']): QAItem[] => [
    { q: 'Nombre del lugar', a: p.venue },
    { q: 'Dirección', a: p.address },
    { q: 'Hora', a: p.time },
    { q: 'Enlace de Google Maps', a: p.mapsUrl },
  ]
  const g = d.regalos.gift_registry

  const sections: QASection[] = [
    {
      id: 'datos',
      title: 'Datos principales',
      items: [
        ...(boda
          ? [{ q: 'Nombre de la novia', a: d.datos.novia }, { q: 'Nombre del novio', a: d.datos.novio }]
          : [{ q: '¿Cómo quieres que se vea tu nombre?', a: d.datos.nombre }]),
        { q: 'Fecha y hora del evento', a: d.datos.event_date ? formatEventDate(d.datos.event_date) : '' },
        { q: 'Hashtag (opcional)', a: d.datos.hashtag },
        { q: 'Mensaje de invitación (opcional)', a: d.datos.invitation_text },
      ],
    },
    {
      id: 'contacto',
      title: 'Confirmación de asistencia',
      items: [
        { q: 'WhatsApp para confirmar asistencia', a: d.contacto.rsvp_phone },
        ...d.contacto.rsvp_phones
          .filter(p => p.phone.trim() || p.label.trim())
          .map((p, i) => ({ q: `Otro número ${i + 1}`, a: [p.label, p.phone].map(s => s.trim()).filter(Boolean).join(' — ') })),
        { q: 'Frase de confirmación', a: d.contacto.confirmation_phrase },
        { q: 'Información importante (opcional)', a: d.contacto.important_info_text },
      ],
    },
    {
      id: 'familia',
      title: 'Familia y padrinos',
      items: [
        { q: boda ? 'Padres de la novia' : 'Mis padres', a: list(d.familia.parent_names) },
        ...(boda ? [{ q: 'Padres del novio', a: list(d.familia.padres_novio) }] : []),
        { q: 'Padrinos', a: list(d.familia.padrinos) },
        ...(template === 'bodasobre' ? [{ q: 'Frase para la sección de familia (opcional)', a: d.familia.familia_frase }] : []),
      ],
    },
    {
      id: 'lugares',
      title: 'Lugares',
      items: [
        ...place(d.lugares.ceremony).map(i => ({ ...i, q: `Ceremonia — ${i.q}` })),
        ...place(d.lugares.reception).map(i => ({ ...i, q: `Recepción — ${i.q}` })),
        ...(boda
          ? d.lugares.hospedajes
              .filter(h => h.nombre.trim() || h.telefono.trim() || h.mapsUrl.trim() || h.sitioWeb.trim() || h.nota.trim())
              .map((h, i) => ({
                q: `Hospedaje recomendado — Hotel ${i + 1}`,
                a: [
                  h.nombre,
                  h.telefono && `Tel: ${h.telefono}`,
                  h.mapsUrl && `Mapa: ${h.mapsUrl}`,
                  h.sitioWeb && `Sitio web: ${h.sitioWeb}`,
                  h.nota && `Nota: ${h.nota}`,
                ].filter(Boolean).join('\n'),
              }))
          : []),
      ],
    },
    {
      id: 'itinerario',
      title: 'Programa del evento (opcional)',
      items: d.itinerario.items
        .filter(i => i.time.trim() || i.description.trim())
        .map((i, n) => ({
          q: `Actividad ${n + 1}`,
          a: [i.time, i.description].map(s => s.trim()).filter(Boolean).join(' — ') +
            (boda && ITINERARY_KINDS.includes(i.kind) ? ` (${KIND_LABEL[i.kind]})` : ''),
        })),
    },
    {
      id: 'vestimenta',
      title: 'Código de vestimenta',
      items: [
        { q: 'Código de vestimenta', a: d.vestimenta.colors },
        { q: 'Notas (opcional)', a: d.vestimenta.notes },
      ],
    },
    {
      id: 'regalos',
      title: 'Mesa de regalos y transferencia (opcional)',
      items: [
        { q: 'Mesa de regalos', a: g.liverpoolLink ? `${STORE_LABEL[g.giftStore] ?? 'Otra tienda'}: ${g.liverpoolLink}` : '' },
        ...d.regalos.gift_registries
          .filter(r => r.liverpoolLink.trim())
          .map((r, i) => ({ q: `Otra mesa de regalos ${i + 1}`, a: `${STORE_LABEL[r.giftStore] ?? 'Otra tienda'}: ${r.liverpoolLink}` })),
        { q: 'Mostrar “Lluvia de sobres”', a: d.regalos.show_lluvia_sobres ? 'Sí' : 'No' },
        { q: 'Mostrar mis datos bancarios', a: d.regalos.show_datos_bancarios ? 'Sí' : 'No' },
        ...(d.regalos.show_datos_bancarios
          ? [
              { q: 'Nombre del beneficiario', a: g.bankBeneficiary },
              { q: g.bankAccountType === 'tarjeta' ? 'Número de tarjeta' : 'CLABE interbancaria', a: g.bankAccount },
            ]
          : []),
      ],
    },
    {
      id: 'musica',
      title: 'Música',
      items: [
        { q: 'Canción y artista', a: d.musica.cancion },
        { q: 'Enlace de YouTube o Spotify (opcional)', a: d.musica.enlace },
      ],
    },
  ]
  return sections
}
