import type { Project } from '@/types/invitation'

const DEFAULT_ITINERARY = [
  { title: 'Misa',           time: '05:00 PM', iconSrc: '/images/elegance/iglesia.png'  },
  { title: 'Recepción',      time: '07:00 PM', iconSrc: '/images/elegance/recepcion.png' },
  { title: 'Coctelería',     time: '08:00 PM', iconSrc: '/images/elegance/coctel.png'    },
  { title: 'Cena',           time: '09:00 PM', iconSrc: '/images/elegance/comida.png'    },
  { title: 'Vals',           time: '10:20 PM', iconSrc: '/images/elegance/vals.png'      },
  { title: 'Baile',          time: '11:30 PM', iconSrc: '/images/elegance/baile.png'     },
  { title: 'Fin del Evento', time: '03:00 AM', iconSrc: '/images/elegance/fin.png'       },
]

interface Props {
  project: Project
}

export default function EleganceItinerary({ project }: Props) {
  const itinerary = project.itinerary?.length ? project.itinerary : DEFAULT_ITINERARY

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
