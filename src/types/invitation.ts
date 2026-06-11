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
  | 'hogwarts'
  | 'sellorosa'
  | 'rosagold'
  | 'magical'

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
}
