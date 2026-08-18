'use client'

import { useRef } from 'react'
import AlbumQRCode from '@/components/AlbumQRCode'

function sendWhatsApp(phone: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
    '_self'
  )
}

interface Props {
  phone: string
  hashtag: string
  mode?: 'instagram' | 'album'
  slug?: string
  dressCodeNotes?: string
}

export default function EleganceWishes({ phone, hashtag, mode = 'instagram', slug, dressCodeNotes }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null)

  return (
    <>
      {phone && (
        <div id="whatsappLink" className="extra show-p-y">
          <img src="/images/elegance/buzon.png" style={{ width: '25%', marginBottom: '3%' }} alt="Buzón" />
          <h3>Buzón de Deseos</h3>
          <p className="texto" style={{ width: '90%' }}>Déjame un lindo mensaje por mis XV años, recibo tus palabras con cariño en este buzón:</p>
          <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
          <div
            className="boton"
            style={{ width: '30%' }}
            onClick={() => sendWhatsApp(phone, messageRef.current?.value ?? '')}
          >
            Enviar Mensaje
          </div>
        </div>
      )}

      {mode === 'album' && slug ? (
        <div className="extra show-p-y">
          <h3>Álbum Digital</h3>
          <p className="texto">Escanea el código y sube tus fotos y videos del evento</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4%' }}>
            <AlbumQRCode slug={slug} />
          </div>
        </div>
      ) : hashtag && (
        <a className="extra show-p-y" href={`https://www.instagram.com/explore/tags/${hashtag}/`} target="_self">
          <img src="/images/elegance/instagram.png" style={{ width: '50%', marginBottom: '4%' }} alt="Instagram" />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">Comparte tus mejores momentos con el Hashtag de Instagram <br />#{hashtag}</p>
          <div className="boton" style={{ width: '30%' }}>Ver Fotos</div>
        </a>
      )}

      {dressCodeNotes && (
        <div className="extra show-p-y">
          <h3>Información Importante</h3>
          <p className="importante">❖ {dressCodeNotes}</p>
        </div>
      )}
    </>
  )
}
