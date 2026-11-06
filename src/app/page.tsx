'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const slides = [
  {
    src: '/promo/sobreros.png',
    name: 'Sobre Animado',
    title: 'Un Sobre que se Abre para Sorprender',
    subtitle: 'Tu invitación empieza con un sello de cera: al tocarlo, el sobre se abre y revela cada detalle de tu fiesta.',
  },
  {
    src: '/promo/esmeralda.webp',
    name: 'Esmeralda',
    title: 'Elegancia en Cada Detalle',
    subtitle: 'Foto principal en círculo, cuenta regresiva, galería, itinerario y mesas de regalos en un solo enlace.',
  },
  {
    src: '/promo/zafiro.webp',
    name: 'Zafiro',
    title: 'Tecnología que Enamora',
    subtitle: 'Efectos contemporáneos, paleta sofisticada y confirmación de asistencia directo a tu WhatsApp.',
  },
  {
    src: '/promo/bodasilueta.png',
    name: 'Boda Silueta',
    title: 'Invitaciones para Bodas',
    subtitle: 'Portada con la foto de los novios, familias de ambos lados, hospedajes recomendados y varias mesas de regalos.',
  },
  {
    src: '/promo/bodasobre.png',
    name: 'Boda Sobre',
    title: 'Tu Boda Empieza con un Sello Dorado',
    subtitle: 'Un sobre de papel con sello de cera que se quiebra al tocarlo, destellos y marco de flores.',
  },
]

const services = [
  {
    icon: '💌',
    title: 'Invitaciones Digitales',
    desc: 'Diseños exclusivos para XV años y Bodas con animaciones, galería de fotos, mapa, cuenta regresiva y confirmación de asistencia por WhatsApp.',
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
      <section className="hero-carousel" aria-roledescription="carrusel">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-tag">{slides[current].name}</span>
            <h1 key={current}>{slides[current].title}</h1>
            <p key={`p${current}`}>{slides[current].subtitle}</p>
            <div className="hero-actions">
              <Link href="/invitaciones" className="btn-site-primary">
                Ver Invitaciones
              </Link>
              <Link href="/contacto" className="btn-site-outline">
                Contáctanos
              </Link>
            </div>
          </div>

          <div className="hero-stage">
            {slides.map((slide, i) => (
              <div key={slide.src} className={`hero-slide ${i === current ? 'active' : ''}`} aria-hidden={i !== current}>
                <img src={slide.src} alt={`Invitación digital ${slide.name}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ver ${slide.name}`}
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
        href="https://api.whatsapp.com/send?phone=525548009724&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/promo/whatsapp.webp" alt="WhatsApp" />
      </a>

      <SiteFooter />
    </div>
  )
}
