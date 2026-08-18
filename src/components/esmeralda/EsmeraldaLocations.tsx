import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function EsmeraldaLocations({ project }: Props) {
  if (!project.ceremony && !project.reception) return null;

  return (
    <>
      {project.ceremony && (
        <a
          style={{ marginTop: "5%" }}
          className="lugar show-p-y iglesia"
          href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="con-foto" src={project.ceremony.photoUrl || "/images/esmeralda/iglesia.jpg"} alt="Iglesia" />
          <h4 className="nombre texto">{project.ceremony.venue}</h4>
          <h4 className="direccion texto">{project.ceremony.address}</h4>
          <div className="button no-print">Ir al Mapa</div>
          <h5 className="texto hora">{project.ceremony.time}</h5>
        </a>
      )}

      {project.reception && (
        <a
          style={{ marginTop: "5%" }}
          className="lugar show-p-y"
          href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="con-foto" src={project.reception.photoUrl || "/images/esmeralda/evento.jpg"} alt="Evento" />
          <h4 className="nombre texto">{project.reception.venue}</h4>
          <h4 className="direccion texto">{project.reception.address}</h4>
          <div className="button no-print">Ir al Mapa</div>
          <h5 className="texto hora">{project.reception.time}</h5>
        </a>
      )}
    </>
  );
}
