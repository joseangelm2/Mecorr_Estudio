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
      className="padding-section text-center bg-overlay-contador bg-img"
      style={{ backgroundImage: 'url(/images/background-mob.jpg)' }}
    >
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="titulo text-white mb-30 wow fadeInUp">La Cuenta Regresiva</h2>
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
          <div className="mt-30 wow fadeInUp" style={{ marginTop: '30px' }}>
            <p className="text-white" style={{ fontSize: '22px', letterSpacing: '2px' }}>
              {day} de {month} de {year}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
