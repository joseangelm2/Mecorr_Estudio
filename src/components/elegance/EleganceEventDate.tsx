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
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
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

export default function EleganceEventDate({ eventDate }: Props) {
  const countdown = useCountdown(eventDate)
  const date = new Date(eventDate)
  const day = date.getDate()
  const month = MONTHS_ES[date.getMonth()]
  const year = date.getFullYear()

  return (
    <>
      <div className="frase show" style={{ fontSize: '5.5vw' }}>Celebremos juntos</div>

      <div className="encabezado show" style={{ marginBottom: '-5%', marginTop: '20px' }}>
        <h3 className="evento">El día</h3>
      </div>

      <div className="fecha">
        <p className="dia">{day}</p>
        <div className="barra" />
        <p className="mes">{month}</p>
        <div className="barra" />
        <p className="anio">{year}</p>
      </div>

      <div className="reloj-silueta">
        <img
          className="foto-full"
          src="/images/elegance/Reloj.png"
          style={{ width: '68%', marginTop: '3%', marginBottom: '5%' }}
          alt=""
        />
        <div className="cuenta">
          <p className="segmento"><span className="numero">{countdown.days}</span><span className="unidad"> Días</span></p>
          <p className="segmento"><span className="numero">{countdown.hours}</span><span className="unidad"> Horas</span></p>
          <p className="segmento"><span className="numero">{countdown.minutes}</span><span className="unidad"> Minutos</span></p>
          <p className="segmento"><span className="numero">{countdown.seconds}</span><span className="unidad"> Segundos</span></p>
        </div>
      </div>

      <div className="frase show" style={{ fontStyle: 'italic' }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables que perduran eternamente...
      </div>
    </>
  )
}
