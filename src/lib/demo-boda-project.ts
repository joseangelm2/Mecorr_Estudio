import type { Project } from '@/types/invitation'
import { DEMO_PROJECT } from '@/lib/demo-project'

const IMG = '/images/bodasilueta'

// Demo de Boda Silueta: datos ficticios y fotos de ejemplo propias (public/images/bodasilueta/).
export const DEMO_BODA: Project = {
  ...DEMO_PROJECT,
  id: 'demo-boda',
  slug: 'bodasilueta',
  template: 'bodasilueta',
  status: 'published',
  quinceanera_name: 'Valeria & Andrés',
  guest_name: null,
  event_date: '2026-12-19T17:00:00',
  rsvp_phone: '5500000000',
  hashtag: '#ValeriaYAndres',
  music_url: `${IMG}/musica.mp3`,
  hero_photo_url: `${IMG}/hero.jpg`,
  parent_names: ['Laura Medina Torres', 'Carlos Ríos Herrera'],
  padrinos: ['Marcela Luna Vega', 'Jorge Salas Ortiz'],
  ceremony: {
    venue: 'Parroquia de San Miguel',
    address: 'Av. Reforma 120, Centro, Querétaro',
    time: '5:00 PM',
    mapsUrl: 'https://maps.google.com',
    photoUrl: `${IMG}/ceremonia.jpg`,
  },
  reception: {
    venue: 'Hacienda Los Arcos',
    address: 'Camino Real 45, Querétaro',
    time: '7:00 PM',
    mapsUrl: 'https://maps.google.com',
    photoUrl: `${IMG}/salon.jpg`,
  },
  itinerary: [
    ['Ceremonia', '5:00 PM', 'iglesia.png'],
    ['Recepción', '7:00 PM', 'recepcion.png'],
    ['Coctel', '7:30 PM', 'coctel.png'],
    ['Cena', '8:30 PM', 'comida.png'],
    ['Vals', '10:00 PM', 'vals.png'],
    ['Baile', '10:30 PM', 'baile.png'],
    ['Fin del Evento', '2:00 AM', 'fin.png'],
  ].map(([title, time, icon]) => ({ title, time, description: title, icon: `${IMG}/${icon}`, iconSrc: `${IMG}/${icon}` })),
  dress_code: { colors: 'Formal / Etiqueta', notes: 'El blanco queda reservado para la novia.' },
  photos: [1, 2, 3, 4, 5, 6].map(n => `${IMG}/galeria-${n}.jpg`),
  gift_registry: {
    giftStore: 'liverpool',
    liverpoolLink: 'https://mesaderegalos.liverpool.com.mx/',
    bankAccount: '000000000000000000',
    bankAccountType: 'clabe',
    bankBeneficiary: 'Valeria Medina Ríos',
  },
  color_theme: 'blanco',
  invitation_text: 'Con la bendición de Dios y de nuestras familias, queremos compartir contigo el día más especial de nuestras vidas.',
  show_lluvia_sobres: true,
  confirmation_phrase: 'Favor de confirmar asistencia antes del 1 de Diciembre',
  extra_config: {
    mis_xv_text: '¡Nos Casamos!',
    padres_novio: ['Rosa Elena Cruz', 'Miguel Ángel Soto'],
    gift_registries: [{ giftStore: 'amazon', liverpoolLink: 'https://www.amazon.com.mx/', iconUrl: '' }],
    hospedajes: [
      { nombre: 'Hotel Casa Real', fotoUrl: `${IMG}/hotel-1.jpg`, mapsUrl: 'https://maps.google.com', sitioWeb: 'https://example.com', telefono: '442 000 0001', nota: 'A 5 minutos de la ceremonia. Menciona la boda Valeria y Andrés.' },
      { nombre: 'Posada del Templo', fotoUrl: `${IMG}/hotel-2.jpg`, mapsUrl: 'https://maps.google.com', sitioWeb: 'https://example.com', telefono: '442 000 0002', nota: 'Tarifa especial para invitados.' },
      { nombre: 'Suites La Hacienda', fotoUrl: `${IMG}/hotel-3.jpg`, mapsUrl: 'https://maps.google.com', telefono: '442 000 0003' },
    ],
  },
}
