'use client'

import { useState, useEffect } from 'react'

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function useCountdown(targetStr: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const target = new Date(targetStr).getTime()
    function update() {
      const diff = target - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetStr])
  return time
}

interface Props {
  eventDate: string
}

export default function EspecialEventDate({ eventDate }: Props) {
  const countdown = useCountdown(eventDate)
  const date  = new Date(eventDate)
  const day   = date.getDate()
  const month = MONTHS_ES[date.getMonth()]
  const year  = date.getFullYear()

  return (
    <section
      id="cuenta-regresiva"
      className="padding-section text-center bg-overlay-contador bg-img"
      style={{ backgroundImage: 'var(--inv-bg-url, url(/images/background-mob.jpg))', paddingBottom: '20px' }}
    >
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="titulo color-titulos mb-30 wow fadeInUp">La Cuenta Regresiva</h2>
          <ul className="tiempo wow fadeInUp">
            <li>
              <span className="circulo-tiempo">{countdown.days}</span>
              <span>Días</span>
            </li>
            <li>
              <span className="circulo-tiempo">{countdown.hours}</span>
              <span>Horas</span>
            </li>
            <li>
              <span className="circulo-tiempo">{countdown.minutes}</span>
              <span>Min</span>
            </li>
            <li>
              <span className="circulo-tiempo">{countdown.seconds}</span>
              <span>Seg</span>
            </li>
          </ul>
          <div className="wow fadeInUp" style={{ marginTop: '30px' }}>
            <p className="text-white" style={{ fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.75 }}>
              ✦ fecha del evento ✦
            </p>
            <p className="texto-frase text-white" style={{ fontSize: '32px', letterSpacing: '3px', lineHeight: 1.1, whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
              {day} · {month} · {year}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
