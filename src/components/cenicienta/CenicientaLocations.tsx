import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function CenicientaLocations({ project }: Props) {
  return (
    <>
      {project.ceremony && (
        <>
          <img
            className="foto-full show-p-y"
            src={project.ceremony.photoUrl || '/images/cenicienta/ceremonia.jpg'}
            style={{ marginTop: '5%', marginBottom: '0%' }}
            alt=""
          />
          <a className="ubicacion show-p-y" href={project.ceremony.mapsUrl} style={{ zIndex: 4 }} target="_blank">
            <div>
              <p className="lugar-titulo">Ceremonia Religiosa</p>
              <p className="lugar">{project.ceremony.venue}</p>
              <span className="direccion">{project.ceremony.address}</span>
              <span className="hora">{project.ceremony.time}</span>
              <div className="boton">Ir al Mapa</div>
            </div>
          </a>
        </>
      )}

      {project.reception && (
        <>
          <img
            className="foto-full show-p-y"
            src={project.reception.photoUrl || '/images/cenicienta/evento.jpg'}
            style={{ marginTop: 'var(--separacion)', marginBottom: '0%' }}
            alt=""
          />
          <a className="ubicacion show-p-y" href={project.reception.mapsUrl} style={{ zIndex: 4 }} target="_blank">
            <div>
              <p className="lugar-titulo">Recepción</p>
              <p className="lugar">{project.reception.venue}</p>
              <span className="direccion">{project.reception.address}</span>
              <span className="hora">{project.reception.time}</span>
              <div className="boton">Ir al Mapa</div>
            </div>
          </a>
        </>
      )}
    </>
  )
}
