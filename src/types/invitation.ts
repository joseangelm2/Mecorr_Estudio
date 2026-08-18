export interface TimelineItem {
  title: string;
  time: string;
  iconSrc: string;
  description?: string;
  icon?: string;
}

export interface LocationInfo {
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  mapLink?: string;
  photoUrl?: string;
}

export interface InvitationData {
  guestName: string;
  honoree: string;
  date: string;
  countdownTarget: string;
  parents: string[];
  godparents: string[];
  invitationText: string;
  ceremony: LocationInfo;
  reception: LocationInfo;
  timeline: TimelineItem[];
  dressCode: string;
  whatsappPhone: string;
  photos: string[];
}

export type TemplateId =
  | 'sobre'
  | 'esmeralda'
  | 'pink'
  | 'love'
  | 'zafiro'
  | 'elegance'
  | 'sellorosa'
  | 'rosagold'
  | 'magical'
  | 'especial'

export interface Project {
  id: string
  slug: string
  template: TemplateId
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  quinceanera_name: string
  guest_name: string | null
  event_date: string
  rsvp_phone: string | null
  hashtag: string | null
  instagram_mode: 'instagram' | 'album'
  music_url: string | null
  hero_photo_url: string | null
  parent_names: string[]
  padrinos: string[]
  ceremony: LocationInfo | null
  reception: LocationInfo | null
  itinerary: TimelineItem[]
  dress_code: { colors: string; notes: string } | null
  photos: string[]
  gift_registry: {
    liverpoolLink?: string
    bankAccount?: string
    bankBeneficiary?: string
    giftStore?: 'liverpool' | 'amazon' | 'palacio' | 'generic'
  } | null
  color_theme: string
  invitation_text: string | null
  show_video: boolean
  video_youtube_id: string | null
  video_url: string | null
  show_lluvia_sobres: boolean
  lluvia_sobres_text: string | null
  show_datos_bancarios: boolean
  datos_bancarios_text: string | null
  show_itinerary: boolean
  confirmation_phrase: string | null
  confirmation_highlight_date: string | null
  extra_config: Record<string, unknown>
  tiene_lista_invitados: boolean
  pin_admin: string | null
}

// ─── Módulo Lista de Invitados ────────────────────────────────────────────────

export type EstadoInvitado = 'alta' | 'enviado' | 'confirmo' | 'baja'
export type ConfirmacionInvitado = 'SI' | 'NO'

export interface GrupoEvento {
  id: string
  project_id: string
  nombre: string
  color: string
  orden: number
  created_at: string
}

export interface Invitado {
  id: string
  project_id: string
  grupo_id: string
  titular: string
  num_invitados: number
  whatsapp: string | null
  token: string
  estado: EstadoInvitado
  confirmacion: ConfirmacionInvitado | null
  fecha_envio: string | null
  fecha_confirmacion: string | null
  mensaje_felicitacion: string | null
  device_id: string | null
  created_at: string
  updated_at: string
  /** Join opcional para mostrar nombre/color del grupo en UI */
  grupo?: GrupoEvento
}
