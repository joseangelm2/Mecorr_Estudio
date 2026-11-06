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
  demoHref?: string
  demoLabel?: string
  internalRoute?: string
  extraDemo?: { href: string; label: string }
}

const invitations: Invitation[] = [
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
    title: 'Elegance',
    description: [
      'Una invitación que transforma el sueño de una quinceañera en realidad digital. Paleta blanco marfil, detalles dorados y una atmósfera de cuento que conquistará a cada invitado.',
    ],
    image: '/promo/elegance.jpg',
    imageAlt: 'Invitación Elegance',
    accent: 'accent-blue1',
    reversed: true,
    demoHref: '/elegance',
    demoLabel: 'Ver demo',
    internalRoute: '/elegance',
  },
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
    extraDemo: { href: '/esmeralda/demo2', label: 'Ver demo 2' },
  },
  {
    title: 'Love',
    description: [
      'Diseñada para protagonizar tus fotos. Colores vibrantes, aire fresco y juvenil que convierten cada imagen en el elemento principal. La elección perfecta para quienes quieren impactar.',
    ],
    image: '/promo/love.jpg',
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
    title: 'Boda Silueta',
    description: [
      'Pensada para bodas: portada con la foto de los novios, papel blanco rugoso y un marco de camelias, rosas y azahares en 3D. Incluye familias de ambos lados, hospedaje recomendado con foto, mapa, sitio web y teléfono, y varias mesas de regalos. Totalmente personalizable.',
    ],
    image: '/promo/bodasilueta.png',
    imageAlt: 'Invitación de boda Boda Silueta',
    accent: 'accent-boda',
    reversed: true,
    demoHref: '/bodasilueta',
    demoLabel: 'Ver demo',
    internalRoute: '/bodasilueta',
    extraDemo: { href: '/bodasilueta/lista-invitados', label: 'Demo lista de invitados' },
  },
  {
    title: 'Boda Sobre',
    description: [
      'Una boda que empieza con un sobre de papel y sello de cera dorado: al tocarlo se abre para revelar la invitación. Incluye familias de ambos lados, hospedaje recomendado, varias mesas de regalos y marco de flores en 3D. Totalmente personalizable.',
    ],
    image: '/promo/bodasobre.png',
    imageAlt: 'Invitación de boda Boda Sobre',
    accent: 'accent-boda',
    reversed: false,
    demoHref: '/bodasobre',
    demoLabel: 'Ver demo',
    internalRoute: '/bodasobre',
  },
  {
    title: 'Magical',
    description: [
      'Un cosmos de fantasía con estrellas animadas, paleta de morado profundo y oro mágico. Efectos de brillo en cada sección, sobre de apertura mágico, galería con lightbox y cuenta regresiva estelar.',
    ],
    image: '/promo/Magical.jpg',
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
      <div style={{ paddingTop: 'var(--sh-h)' }}>
        <div style={{ padding: '48px 24px 0', textAlign: 'center', background: '#fff' }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
            Nuestras Invitaciones
          </h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(14px, 2vw, 17px)', marginBottom: 0, paddingBottom: 32 }}>
            Diseños exclusivos para XV años y Bodas — elige el que refleje tu personalidad
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
                  {(inv.internalRoute ?? inv.demoHref) && (
                    <Link href={(inv.internalRoute ?? inv.demoHref)!} className="btn-demo btn-primary">
                      {inv.demoLabel ?? 'Ver demo'}
                    </Link>
                  )}
                  {inv.extraDemo && (
                    <Link href={inv.extraDemo.href} className="btn-demo btn-primary">
                      {inv.extraDemo.label}
                    </Link>
                  )}
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
          href="https://api.whatsapp.com/send?phone=525548009724&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital"
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
