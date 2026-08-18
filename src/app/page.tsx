'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const slides = [
  {
    src: '/promo/portadaxv.png',
    title: 'Invitaciones Digitales para XV Años',
    subtitle: 'Cada quinceañera merece una experiencia única. Diseños exclusivos que sorprenden a cada invitado.',
  },
  {
    src: '/promo/esmeralda.webp',
    title: 'Elegancia en Cada Detalle',
    subtitle: 'Tipografía de alta gama, animaciones fluidas y personalización completa para tu gran día.',
  },
  {
    src: '/promo/zafiro.webp',
    title: 'Tecnología que Enamora',
    subtitle: 'Sobre de apertura, cuenta regresiva, galería de fotos y confirmación de asistencia en un solo enlace.',
  },
  {
    src: '/promo/elegance.jpg',
    title: 'Un Cuento Hecho Realidad',
    subtitle: 'Paleta blanco marfil, detalles dorados y una atmósfera de cuento que conquista a cada invitado.',
  },
]

const services = [
  {
    icon: '💌',
    title: 'Invitaciones Digitales',
    desc: 'Diseños exclusivos para XV años con animaciones, galería de fotos, mapa, cuenta regresiva y confirmación de asistencia por WhatsApp.',
  },
  {
    icon: '🌐',
    title: 'Sitios Web a Medida',
    desc: 'Páginas web profesionales para negocios, portfolios y proyectos. Rápidas, modernas y optimizadas para móvil.',
  },
  {
    icon: '⚡',
    title: 'Soluciones Digitales',
    desc: 'Automatizaciones, integraciones y herramientas digitales que hacen crecer tu negocio con tecnología de punta.',
  },
]

export default function LandingPage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-page">
      <SiteHeader />

      {/* Hero Carousel */}
      <section className="hero-carousel">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === current ? 'active' : ''}`}>
            <img src={slide.src} alt={slide.title} />
            <div className="hero-slide-overlay" />
          </div>
        ))}

        <div className="hero-content">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].subtitle}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/invitaciones" className="btn-site-primary">
              Ver Invitaciones
            </Link>
            <Link href="/contacto" className="btn-site-outline">
              Contáctanos
            </Link>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="services-section">
        <h2 className="section-title">Nuestros Servicios</h2>
        <p className="section-subtitle">Soluciones digitales creativas para momentos que merecen recordarse</p>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="landing-cta">
        <h2 className="section-title" style={{ marginBottom: 12 }}>
          ¿Listo para comenzar?
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 32 }}>
          Cuéntanos tu proyecto y juntos lo hacemos realidad.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/invitaciones" className="btn-site-primary">
            Ver Invitaciones
          </Link>
          <Link href="/contacto" className="btn-site-outline">
            Hablar con nosotros
          </Link>
        </div>
      </section>

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
  )
}
