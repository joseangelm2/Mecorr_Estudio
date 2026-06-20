import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EspecialLocations({ project }: Props) {
  return (
    <>
      {project.ceremony && (
        <section className="padding-section text-center">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="mb-10 wow fadeInUp">
                <img src="/images/flores-01.png" width="100" alt="" />
              </div>
              <h2 className="titulo color-titulos mb-20 wow fadeInUp">Ceremonia Religiosa</h2>
              {project.ceremony.photoUrl && (
                <img src={project.ceremony.photoUrl} alt="Ceremonia" width="100%" className="mb-20 wow fadeInUp" style={{ borderRadius: '8px' }} />
              )}
              <p className="color-textos mb-10 wow fadeInUp">{project.ceremony.venue}</p>
              <p className="color-textos mb-10 wow fadeInUp">{project.ceremony.address}</p>
              <p className="color-textos mb-20 wow fadeInUp">{project.ceremony.time}</p>
              {project.ceremony.mapsUrl && (
                <a href={project.ceremony.mapsUrl} target="_blank" rel="noreferrer" className="color-principal link-abrir wow fadeInUp">
                  Ver en Mapa
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {project.reception && (
        <section className="padding-section text-center">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="mb-10 wow fadeInUp">
                <img src="/images/flores-01.png" width="100" alt="" />
              </div>
              <h2 className="titulo color-titulos mb-20 wow fadeInUp">Recepción</h2>
              {project.reception.photoUrl && (
                <img src={project.reception.photoUrl} alt="Recepción" width="100%" className="mb-20 wow fadeInUp" style={{ borderRadius: '8px' }} />
              )}
              <p className="color-textos mb-10 wow fadeInUp">{project.reception.venue}</p>
              <p className="color-textos mb-10 wow fadeInUp">{project.reception.address}</p>
              <p className="color-textos mb-20 wow fadeInUp">{project.reception.time}</p>
              {project.reception.mapsUrl && (
                <a href={project.reception.mapsUrl} target="_blank" rel="noreferrer" className="color-principal link-abrir wow fadeInUp">
                  Ver en Mapa
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
