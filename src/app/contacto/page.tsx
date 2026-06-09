import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const contactItems = [
  {
    href: 'mailto:contacto@mecorr.com.mx',
    icon: '/promo/icons/mail.svg',
    label: 'Email',
    value: 'contacto@mecorr.com.mx',
  },
  {
    href: 'https://api.whatsapp.com/send?phone=525579410833&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital',
    icon: '/promo/icons/brand-whatsapp.svg',
    label: 'WhatsApp',
    value: '+52 55 7941 0833',
    external: true,
  },
  {
    href: 'https://www.mecorr.com.mx',
    icon: '/promo/icons/world-www.svg',
    label: 'Sitio web',
    value: 'mecorr.com.mx',
    external: true,
  },
]

const socialLinks = [
  {
    href: 'https://www.instagram.com/mecorr.mx',
    icon: '/promo/icons/Instagram.svg',
    label: 'Instagram',
  },
  {
    href: 'https://www.facebook.com/mecorrmx',
    icon: '/promo/icons/facebook.svg',
    label: 'Facebook',
  },
  {
    href: 'https://api.whatsapp.com/send?phone=525579410833&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital',
    icon: '/promo/icons/brand-whatsapp.svg',
    label: 'WhatsApp',
  },
]

export default function ContactoPage() {
  return (
    <div className="contacto-page">
      <SiteHeader />

      <div className="contacto-inner">
        <h1>Hablemos</h1>
        <p className="lead">
          Cuéntanos tu proyecto. Estamos listos para crear algo extraordinario juntos.
        </p>

        {/* Contact cards */}
        <div className="contact-cards">
          {contactItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="contact-card"
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="social-section">
          <h2>Encuéntranos en redes</h2>
          <div className="social-icons">
            {socialLinks.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="social-icon-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <img src={s.icon} alt={s.label} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
