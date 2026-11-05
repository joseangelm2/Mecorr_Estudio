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
    ['Ceremonia', '5:00 PM', 'iglesia.svg'],
    ['Recepción', '7:00 PM', 'recepcion.svg'],
    ['Coctel', '7:30 PM', 'coctel.svg'],
    ['Cena', '8:30 PM', 'comida.svg'],
    ['Vals', '10:00 PM', 'vals.svg'],
    ['Baile', '10:30 PM', 'baile.svg'],
    ['Fin del Evento', '2:00 AM', 'fin.svg'],
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

// Demo de Boda Sobre: mismas secciones y datos de ejemplo que Boda Silueta, con portada de sobre.
const BASE_SOBRE: Project = JSON.parse(JSON.stringify(DEMO_BODA).replaceAll('/images/bodasilueta', '/images/bodasobre'))

export const DEMO_BODASOBRE: Project = {
  ...BASE_SOBRE,
  id: 'demo-bodasobre',
  slug: 'bodasobre',
  template: 'bodasobre',
  color_theme: 'champagne',
  hero_photo_url: '/images/bodasobre/hero-novios.jpg',
  extra_config: {
    ...BASE_SOBRE.extra_config,
    // Paleta de vestimenta en tonos champagne para que la demo sea toda del mismo color.
    dress_palette: [
      { name: 'Champagne', colors: ['#e9d8a6'] },
      { name: 'Dorado', colors: ['#b89b5e'] },
      { name: 'Marfil', colors: ['#fbf6e9'] },
      { name: 'Beige', colors: ['#d9c7a7'] },
      { name: 'Café claro', colors: ['#8a7440'] },
    ],
    familia_foto_novia: '/images/bodasobre/familia-novia.jpg',
    familia_foto_novio: '/images/bodasobre/familia-novio.jpg',
    familia_foto_padrinos: '/images/bodasobre/familia-padrinos.jpg',
  },
}
