import type { Project } from '@/types/invitation'

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialItinerary({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const itinerary = project.itinerary

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
