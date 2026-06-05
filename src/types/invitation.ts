export interface TimelineItem {
  title: string;
  time: string;
  iconSrc: string;
}

export interface LocationInfo {
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
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
