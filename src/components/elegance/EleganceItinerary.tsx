import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EleganceItinerary({ project }: Props) {
  const itinerary = project.itinerary

  return (
    <div className="itinerario show-p-y">
      <h3>Programa del Evento</h3>
      <div style={{ width: '100%' }}>
        {itinerary.map((item, i) => {
          const isLeft = i % 2 === 0
          return (
            <div key={i} className={`evento ${isLeft ? 'izquierda' : 'derecha'}`} style={i === 0 ? { marginTop: '4vw' } : undefined}>
              {isLeft ? (
                <>
                  <div className="icono show-n-x"><div className="circulo"><img src={item.iconSrc} alt={item.title} /></div></div>
                  <div className="item show-p-x"><h4 className="nombre">{item.title}</h4><p className="hora">{item.time}</p></div>
                </>
              ) : (
                <>
                  <div className="item show-n-x"><h4 className="nombre">{item.title}</h4><p className="hora">{item.time}</p></div>
                  <div className="icono show-p-x"><div className="circulo"><img src={item.iconSrc} alt={item.title} /></div></div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
