import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

interface Invitation {
  title: string
  description: string[]
  image: string
  imageAlt: string
  accent: string
  reversed: boolean
  demoHref: string
  demoLabel?: string
  internalRoute?: string
}

const invitations: Invitation[] = [
  {
    title: 'Esmeralda',
    description: [
      'Elegancia en cada detalle — un círculo animado enmarca la foto principal, mientras decoraciones florales dan vida a cada sección. Una invitación que cautiva desde el primer instante.',
    ],
    image: '/promo/esmeralda.webp',
    imageAlt: 'Invitación digital Esmeralda',
    accent: 'accent-green',
    reversed: true,
    demoHref: '/esmeralda',
    demoLabel: 'Ver demo',
    internalRoute: '/esmeralda',
  },
  {
    title: 'Sobre Animado',
    description: [
      'Una experiencia que comienza con un sobre que se abre para revelar la invitación. Incluye itinerario animado, cuenta regresiva y confirmación por WhatsApp. Disponible en 6 paletas de color.',
    ],
    image: '/promo/sobreros.png',
    imageAlt: 'Invitación Sobre Animado',
    accent: 'accent-sobrose',
    reversed: false,
    demoHref: '/sobre',
    demoLabel: 'Ver demo con selector de color',
    internalRoute: '/sobre',
  },
  {
    title: 'Love',
    description: [
      'Diseñada para protagonizar tus fotos. Colores vibrantes, aire fresco y juvenil que convierten cada imagen en el elemento principal. La elección perfecta para quienes quieren impactar.',
    ],
    image: '/promo/rubi.webp',
    imageAlt: 'Invitación Love',
    accent: 'accent-red',
    reversed: true,
    demoHref: '/love',
    demoLabel: 'Ver demo',
    internalRoute: '/love',
  },
  {
    title: 'Zafiro',
    description: [
      'Impacto visual desde la primera pantalla. Efectos contemporáneos, paleta sofisticada y tipografía de alta gama que posicionan esta invitación como una de las más vanguardistas del catálogo.',
    ],
    image: '/promo/zafiro.webp',
    imageAlt: 'Invitación Zafiro',
    accent: 'accent-purple',
    reversed: false,
    demoHref: '/zafiro',
    demoLabel: 'Ver demo',
    internalRoute: '/zafiro',
  },
  {
    title: 'Pink',
    description: [
      'La distinción de una invitación impresa, llevada al mundo digital. Fondos sutiles, tipografía cuidadosamente seleccionada y detalles refinados que reflejan el prestigio del evento.',
    ],
    image: '/promo/amatista.webp',
    imageAlt: 'Invitación Pink',
    accent: 'accent-pink',
    reversed: true,
    demoHref: '/pink',
    demoLabel: 'Ver demo',
    internalRoute: '/pink',
  },
  {
    title: 'Elegance',
    description: [
      'Una invitación que transforma el sueño de una quinceañera en realidad digital. Paleta blanco marfil, detalles dorados y una atmósfera de cuento que conquistará a cada invitado.',
    ],
    image: '/promo/elegance.png',
    imageAlt: 'Invitación Elegance',
    accent: 'accent-blue1',
    reversed: true,
    demoHref: '/cenicienta',
    demoLabel: 'Ver demo',
    internalRoute: '/cenicienta',
  },
  {
    title: 'Rosa Gold',
    description: [
      'Rosa y dorado en perfecta armonía. Tipografía de alta gama que resalta el nombre de la quinceañera, galería de fotos, itinerario y confirmación de asistencia. Elegancia en cada scroll.',
    ],
    image: '/promo/rosapastel.png',
    imageAlt: 'Invitación Rosa Gold',
    accent: 'accent-pinkk',
    reversed: false,
    demoHref: '/rosagold',
    demoLabel: 'Ver demo',
    internalRoute: '/rosagold',
  },
  {
    title: 'Hogwarts',
    description: [
      'El mundo mágico de Harry Potter llega a tu celebración. Tipografía inspirada en los libros, gráficos del universo mágico y una atmósfera que hará sentir a todos parte de la magia.',
    ],
    image: '/promo/harrys.png',
    imageAlt: 'Invitación Hogwarts',
    accent: 'accent-harry',
    reversed: true,
    demoHref: '/hogwarts',
    demoLabel: 'Ver demo',
    internalRoute: '/hogwarts',
  },
  {
    title: 'Sello Rosa',
    description: [
      'Una experiencia que comienza con el sello de la quinceañera en el sobre. Mariposas rosas en movimiento y personalización de nombre y pases para cada invitado. Solo disponible en celular.',
    ],
    image: '/promo/sellorosa.png',
    imageAlt: 'Invitación Sello Rosa',
    accent: 'accent-sellorosa',
    reversed: false,
    demoHref: '/sellorosa',
    demoLabel: 'Ver demo',
    internalRoute: '/sellorosa',
  },
  {
    title: 'Magical',
    description: [
      'Un cosmos de fantasía con estrellas animadas, paleta de morado profundo y oro mágico. Efectos de brillo en cada sección, sobre de apertura mágico, galería con lightbox y cuenta regresiva estelar.',
    ],
    image: '/promo/magical.webp',
    imageAlt: 'Invitación Magical',
    accent: 'accent-magical',
    reversed: true,
    demoHref: '/magical',
    demoLabel: 'Ver demo',
    internalRoute: '/magical',
  },
]

export default function InvitacionesPage() {
  return (
    <div className="invitaciones-page">
      <SiteHeader />

      {/* Page header */}
      <div style={{ paddingTop: '65px' }}>
        <div style={{ padding: '48px 24px 0', textAlign: 'center', background: '#fff' }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
            Nuestras Invitaciones
          </h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(14px, 2vw, 17px)', marginBottom: 0, paddingBottom: 32 }}>
            Diseños exclusivos para XV años — elige el que refleje tu personalidad
          </p>
        </div>

        {/* Invitations */}
        {invitations.map((inv, i) => (
          <section key={i} className="promo-section">
            <h2>{inv.title}</h2>
            <div className={`section-body ${inv.accent} accent ${inv.reversed ? 'reverse' : ''}`}>
              <div className="info-panel">
                {inv.description.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                <div className="buttons-row">
                  <Link href={inv.internalRoute ?? inv.demoHref} className="btn-demo btn-primary">
                    {inv.demoLabel ?? 'Ver demo'}
                  </Link>
                </div>
              </div>
              <div className="main-image">
                <img src={inv.image} alt={inv.imageAlt} />
              </div>
            </div>
          </section>
        ))}

        {/* WhatsApp flotante */}
        <a
          className="whatsapp-float"
          href="https://api.whatsapp.com/send?phone=525579410833&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/promo/whatsapp.webp" alt="WhatsApp" />
        </a>

        <SiteFooter />
      </div>
    </div>
  )
}
