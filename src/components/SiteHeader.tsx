'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/invitaciones', label: 'Invitaciones' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/admin', label: 'Admin', cta: true },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="sh">
        <div className="sh-inner">
          {/* Brand */}
          <Link href="/" className="sh-brand" onClick={() => setOpen(false)}>
            <img src="/promo/logo_mecorr2.png" alt="MeCorr" />
            <div className="sh-brand-text">
              <span className="sh-brand-name">MeCorr Estudio</span>
              <span className="sh-brand-tagline">Soluciones Digitales</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav>
            <ul className="sh-nav">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      isActive(link.href) ? 'active' : '',
                      link.cta ? 'sh-cta' : '',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hamburger */}
          <button
            className="sh-hamburger"
            aria-label="Menú"
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <nav className={`sh-mobile-menu ${open ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              isActive(link.href) ? 'active' : '',
              link.cta ? 'sh-cta' : '',
            ].join(' ')}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
