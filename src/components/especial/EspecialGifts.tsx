'use client'

import { useState } from 'react'
import type { Project } from '@/types/invitation'

const STORE_ICONS: Record<string, string> = {
  liverpool: '/images/elegance/liverpool.png',
  amazon:    '/images/elegance/amazon.svg',
  palacio:   '/images/elegance/palacio.svg',
  generic:   '/images/elegance/mesa_regalos.png',
}

const STORE_LABELS: Record<string, string> = {
  liverpool: 'Liverpool',
  amazon:    'Amazon',
  palacio:   'El Palacio de Hierro',
  generic:   'Mesa de Regalos',
}

interface GiftRegistry {
  giftStore: string
  liverpoolLink: string
}

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialGifts({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const extraRegistries = (project.extra_config?.gift_registries as GiftRegistry[] | undefined) ?? []
  const hasExtraLinks   = extraRegistries.length > 0
  const hasFallbackLink = Boolean(project.gift_registry?.liverpoolLink)
  const hasGiftLink     = hasExtraLinks || hasFallbackLink
  const hasLluvia       = project.show_lluvia_sobres
  const hasBancarios    = project.show_datos_bancarios && Boolean(project.gift_registry?.bankAccount)

  if (!hasGiftLink && !hasLluvia && !hasBancarios) return null

  function handleCopy() {
    const clean = (project.gift_registry?.bankAccount ?? '').replace(/\s/g, '')
    navigator.clipboard.writeText(clean).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <section className="padding-section">
      <div className="row justify-content-center">
        <div className="col-md-10 text-center">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-30 wow fadeInUp">Regalos</h2>

          {hasLluvia && (
            <div className="mb-20 wow fadeInUp">
              <img src="/images/elegance/sobre.png" style={{ width: '80px', marginBottom: '16px' }} alt="Sobre" />
              <h3 className="titulo color-titulos mb-10">Lluvia de Sobres</h3>
              <p className="color-textos">
                {project.lluvia_sobres_text || 'Es la tradición de regalar dinero en efectivo dentro de un sobre.'}
              </p>
            </div>
          )}

          {hasLluvia && (hasExtraLinks || hasFallbackLink) && (
            <div className="mb-20 wow fadeInUp">
              <img src={decorationSrc} width="80" alt="" />
            </div>
          )}

          {hasExtraLinks && extraRegistries.map((reg, i) => {
            const storeIcon  = STORE_ICONS[reg.giftStore] ?? STORE_ICONS.liverpool
            const storeLabel = STORE_LABELS[reg.giftStore] ?? 'Mesa de Regalos'
            return (
              <div key={i} className="mb-20 wow fadeInUp">
                <img src={storeIcon} alt={storeLabel} style={{ width: '120px', marginBottom: '16px' }} />
                <a href={reg.liverpoolLink} target="_blank" rel="noreferrer" className="color-principal link-abrir">
                  Ver Mesa de Regalos
                </a>
              </div>
            )
          })}

          {!hasExtraLinks && hasFallbackLink && (() => {
            const giftStore  = project.gift_registry?.giftStore ?? 'liverpool'
            const storeIcon  = STORE_ICONS[giftStore] ?? STORE_ICONS.liverpool
            const storeLabel = STORE_LABELS[giftStore] ?? 'Liverpool'
            return (
              <div className="mb-20 wow fadeInUp">
                <img src={storeIcon} alt={storeLabel} style={{ width: '120px', marginBottom: '16px' }} />
                <a href={project.gift_registry!.liverpoolLink} target="_blank" rel="noreferrer" className="color-principal link-abrir">
                  Ver Mesa de Regalos
                </a>
              </div>
            )
          })()}

          {hasBancarios && (
            <div className="wow fadeInUp">
              <img src="/images/elegance/mesa_regalos.png" style={{ width: '60px', marginBottom: '16px' }} alt="Transferencia" />
              <h3 className="titulo color-titulos mb-10">Datos Bancarios</h3>
              <p className="color-textos mb-20">
                {project.datos_bancarios_text || 'Si lo prefieres puedes hacer una transferencia bancaria:'}
              </p>
              {!visible ? (
                <button className="btn-form" onClick={() => setVisible(true)}>Mostrar cuenta</button>
              ) : (
                <div className="color-textos">
                  <p><b>Cuenta:</b> {project.gift_registry!.bankAccount}</p>
                  {project.gift_registry?.bankBeneficiary && (
                    <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
                  )}
                  <button className="btn-form" style={{ marginTop: '16px' }} onClick={handleCopy}>
                    {copied ? '¡Copiado!' : 'Copiar número'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
