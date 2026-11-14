import { z } from 'zod'

/**
 * Esquemas Zod del formulario del cliente. Son también la lista blanca de lo que el
 * cliente puede escribir: cualquier clave que no esté aquí se descarta (Zod la elimina).
 * `template`, `slug`, `status`, `color_theme` y el diseño NO están y nunca se aceptan.
 */

const MEDIA_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/`

const text = (max = 200) => z.string().trim().max(max).default('')

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(v => v === '' || /^https?:\/\/[^\s/]+\S*$/i.test(v), 'Debe ser un enlace que empiece con http:// o https://')
  .default('')

/** Fotos/audio: solo nuestro storage (o archivos del propio sitio que ya puso el admin). */
const mediaUrl = z
  .string()
  .trim()
  .max(600)
  .refine(
    v => v === '' || v.startsWith(MEDIA_PREFIX) || v.startsWith('/images/'),
    'Archivo no válido',
  )
  .default('')

const stringList = (maxItems: number) =>
  z.array(z.string().trim().max(120)).max(maxItems).default([])

// photoUrl / fotoUrl: el cliente no sube fotos. Viajan ocultos para no borrar las que puso el admin.
/** Enlaces aceptados para la música sugerida: YouTube y Spotify. */
const MUSIC_LINK =
  /^https:\/\/(?:(?:www|m|music)\.)?(?:youtube\.com|youtu\.be|open\.spotify\.com|spotify\.link)(?:[/?#]\S*)?$/i

const place = z.object({
  venue: text(150),
  address: text(300),
  time: text(30),
  mapsUrl: httpUrl,
  photoUrl: mediaUrl,
})

export const ITINERARY_KINDS = ['ceremonia', 'recepcion', 'coctel', 'cena', 'vals', 'baile', 'fin', 'otro'] as const

export const SECTION_SCHEMAS = {
  datos: z.object({
    nombre: text(120),
    novia: text(80),
    novio: text(80),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Elige la fecha y hora del evento').max(25),
    hashtag: text(60),
    invitation_text: text(600),
  }),
  contacto: z.object({
    rsvp_phone: text(25),
    rsvp_phones: z.array(z.object({ label: text(60), phone: text(25) })).max(4).default([]),
    rsvp_email: z.string().trim().max(120).refine(v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Correo no válido').default(''),
    confirmation_phrase: text(200),
    important_info_text: text(800),
  }),
  familia: z.object({
    parent_names: stringList(4),
    padrinos: stringList(6),
    padres_novio: stringList(4),
    familia_frase: text(300),
  }),
  lugares: z.object({
    ceremony: place,
    reception: place,
    hospedajes: z
      .array(z.object({
        nombre: text(120),
        fotoUrl: mediaUrl,
        mapsUrl: httpUrl,
        sitioWeb: httpUrl,
        telefono: text(30),
        nota: text(300),
      }))
      .max(6)
      .default([]),
  }),
  itinerario: z.object({
    items: z.array(z.object({
      time: text(30),
      description: text(100),
      kind: z.enum(ITINERARY_KINDS).default('otro'),
      /** Ícono que ya puso el admin (plantillas que no son de boda); el cliente no lo elige. */
      icon: z
        .string()
        .trim()
        .max(300)
        .refine(v => v === '' || v.length <= 4 || v.startsWith(MEDIA_PREFIX) || v.startsWith('/images/'), 'Ícono no válido')
        .default(''),
    })).max(14).default([]),
  }),
  vestimenta: z.object({
    colors: text(120),
    notes: text(400),
  }),
  regalos: z.object({
    gift_registry: z.object({
      giftStore: z.enum(['liverpool', 'amazon', 'palacio', 'sears', 'generic']).default('liverpool'),
      liverpoolLink: httpUrl,
      bankAccount: text(30),
      bankAccountType: z.enum(['clabe', 'tarjeta']).default('clabe'),
      bankBeneficiary: text(120),
    }),
    gift_registries: z
      .array(z.object({
        giftStore: z.enum(['liverpool', 'amazon', 'palacio', 'sears', 'generic']).default('generic'),
        liverpoolLink: httpUrl,
      }))
      .max(4)
      .default([]),
    show_lluvia_sobres: z.boolean().default(false),
    show_datos_bancarios: z.boolean().default(false),
  }),
  musica: z.object({
    cancion: text(150),
    enlace: z
      .string()
      .trim()
      .max(500)
      .refine(v => v === '' || MUSIC_LINK.test(v), 'Pega un enlace de YouTube o Spotify')
      .default(''),
  }),
} as const

export type SectionId = keyof typeof SECTION_SCHEMAS
export type SectionData<K extends SectionId = SectionId> = z.infer<(typeof SECTION_SCHEMAS)[K]>
export type ClientData = { [K in SectionId]: SectionData<K> }
export type ItineraryKind = (typeof ITINERARY_KINDS)[number]

export function isBoda(template: string): boolean {
  return template === 'bodasilueta' || template === 'bodasobre'
}

export const SECTION_META: Record<SectionId, { title: string; description: string; optional?: boolean }> = {
  datos: { title: 'Datos principales', description: 'Nombres, fecha del evento y mensaje de invitación.' },
  contacto: { title: 'Confirmación de asistencia', description: 'A qué WhatsApp o correo te confirman los invitados.' },
  familia: { title: 'Familia y padrinos', description: 'Los nombres que aparecerán en tu invitación.' },
  lugares: { title: 'Lugares', description: 'Dónde será la ceremonia y la recepción.' },
  itinerario: { title: 'Programa del evento', description: 'El orden de tu evento, hora por hora.', optional: true },
  vestimenta: { title: 'Código de vestimenta', description: 'Cómo te gustaría que vayan vestidos tus invitados.' },
  regalos: { title: 'Mesa de regalos y transferencia', description: 'Mesa de regalos, lluvia de sobres y datos para transferencia bancaria.', optional: true },
  musica: { title: 'Música', description: 'Dinos qué canción te gustaría para tu invitación.' },
}

/** Orden de los pasos del formulario. Dentro de cada paso, los campos de boda solo salen si isBoda(template). */
export const SECTION_ORDER: SectionId[] = ['datos', 'contacto', 'familia', 'lugares', 'itinerario', 'vestimenta', 'regalos', 'musica']
