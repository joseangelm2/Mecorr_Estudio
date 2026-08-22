import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function LoveLocations({ project }: Props) {
  return (
    <div id="ubicaciones" className="contain">
      <div className="frase-container show-p-y">
        <h2 className="subtitulo">Te Invito a mis XV</h2>
        <img src="/images/love/9_separador.png" className="separador" alt="" />
        <p className="texto" style={{ width: "90%", margin: "auto" }}>
          {project.invitation_text ||
            "Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida"}
        </p>
      </div>

      <div className="ubicaciones">
        <h2 className="subtitulo show-p-y">¿Dónde &amp; cuándo?</h2>
        <img src="/images/love/9_separador.png" className="separador" alt="" />

        {project.ceremony && (
          <a
            style={{ marginTop: "5%" }}
            className="lugar show-n-x"
            href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.ceremony.photoUrl && (
              <img className="con-foto" src={project.ceremony.photoUrl} alt={project.ceremony.venue} />
            )}
            <h4 className="nombre texto">{project.ceremony.venue}</h4>
            <h4 className="direccion texto">{project.ceremony.address}</h4>
            <h5 className="texto hora">{project.ceremony.time}</h5>
            <div className="button">Ir al Mapa</div>
          </a>
        )}

        {project.reception && (
          <a
            style={{ marginTop: "5%" }}
            className="lugar show-p-x"
            href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.reception.photoUrl && (
              <img className="con-foto" src={project.reception.photoUrl} alt={project.reception.venue} />
            )}
            <h4 className="nombre texto">{project.reception.venue}</h4>
            <h4 className="direccion texto">{project.reception.address}</h4>
            <h5 className="texto hora">{project.reception.time}</h5>
            <div className="button">Ir al Mapa</div>
          </a>
        )}
      </div>
    </div>
  );
}
