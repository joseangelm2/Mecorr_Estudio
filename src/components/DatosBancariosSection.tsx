'use client'

import { useState } from 'react'

interface Props {
  bankAccount?: string
  bankBeneficiary?: string
  text?: string
}

export default function DatosBancariosSection({
  bankAccount = '',
  bankBeneficiary,
  text,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const clean = (bankAccount ?? '').replace(/\s/g, '')
    navigator.clipboard.writeText(clean).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <section
      id="datos-bancarios"
      className="padding-section"
      style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
    >
      <div className="container" style={{ maxWidth: '100%', padding: '0 15px' }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/images/flores-01.png" width="160" alt="" />
            </div>
            <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
              Datos Bancarios
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp invitation-text-content">
              {text || 'Si deseas realizarme un regalo monetario, aquí encontrarás mis datos bancarios.'}
            </p>

            <div className="text-center wow fadeInUp" style={{ marginBottom: '30px' }}>
              {!visible ? (
                <button onClick={() => setVisible(true)} className="btn-form">
                  Mostrar cuenta
                </button>
              ) : (
                <div>
                  {bankBeneficiary && (
                    <p className="color-textos mb-20" style={{ fontSize: '16px' }}>
                      <strong>Beneficiario:</strong><br />{bankBeneficiary}
                    </p>
                  )}
                  <p
                    className="color-textos mb-20"
                    style={{ fontSize: '18px', letterSpacing: '2px', fontWeight: 600 }}
                  >
                    CLABE: {bankAccount}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="btn-form"
                    style={{ transition: 'background 0.2s' }}
                  >
                    {copied ? '¡Copiado!' : 'Copiar número'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
