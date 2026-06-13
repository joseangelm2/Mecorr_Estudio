import type { Project } from "@/types/invitation";

interface Props { project: Project }

export default function PinkLocations({ project }: Props) {
  if (!project.ceremony && !project.reception) return null;

  return (
    <>
      {project.ceremony && (
        <>
          {project.ceremony.photoUrl && (
            <img className="foto-full show-p-y" src={project.ceremony.photoUrl}
              style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />
          )}
          <a className="ubicacion show-p-y"
            href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"} target="_self">
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
          {project.reception.photoUrl && (
            <img className="foto-full show-p-y" src={project.reception.photoUrl}
              style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />
          )}
          <a className="ubicacion show-p-y"
            href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"} target="_self">
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
  );
}
