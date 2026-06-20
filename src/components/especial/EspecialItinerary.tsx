import type { Project, TimelineItem } from '@/types/invitation'


const DEFAULT_ITINERARY: TimelineItem[] = [
  { title: 'Misa',           time: '05:00 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Recepción',      time: '07:00 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Coctelería',     time: '08:00 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Cena',           time: '09:00 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Vals',           time: '10:20 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Baile',          time: '11:30 PM', iconSrc: '/images/sobre-derecho.png' },
  { title: 'Fin del Evento', time: '03:00 AM', iconSrc: '/images/sobre-derecho.png' },
]

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialItinerary({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const itinerary = project.itinerary?.length ? project.itinerary : DEFAULT_ITINERARY

  return (
    <section className="padding-section text-center" style={{ paddingBottom: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-30 wow fadeInUp">Programa del Evento</h2>
          <div className="timeline-container wow fadeInUp">
            <ul className="vertical-scrollable-timeline">
              <div className="list-progress"><div className="inner" /></div>
              {itinerary.map((item, i) => (
                <li key={i}>
                  <h3 className="color-textos">{item.title}</h3>
                  <p className="color-textos">{item.time}</p>
                  <div className="icon-holder">
                    {(item.icon || item.iconSrc) && (
                      <img src={item.icon || item.iconSrc} alt={item.title} width="38" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
