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
  | 'cenicienta'
  | 'hogwarts'
  | 'sellorosa'
  | 'rosagold'

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
  extra_config: Record<string, unknown>
}
