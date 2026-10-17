import type { Project } from "@/types/invitation";

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

interface Props {
  project: Project;
}

export default function EsmeraldaHero({ project }: Props) {
  const fullName = project.quinceanera_name ?? "";
  const d = new Date(project.event_date);
  const dateStr = `${String(d.getDate()).padStart(2, "0")}.${MONTHS[d.getMonth()]}.${d.getFullYear()}`;
  const misXvText = (project.extra_config?.mis_xv_text as string) || "¡Mis XV!";
  const numeroSrc = (project.extra_config?.numero_url as string) || "/images/esmeralda/15.png";
  const bandaSrc = (project.extra_config?.banda_url as string) || "/images/esmeralda/banda.png";
  const aroSrc = (project.extra_config?.aro_url as string) || "/images/esmeralda/aro.png";
  const aroGifSrc = (project.extra_config?.aro_gif_url as string) || "/images/esmeralda/aro.gif";

  return (
    <>
      <h1 className="event texto" style={{ textAlign: "center", marginTop: "5vw" }}>
        {misXvText}
      </h1>

      {/* Foto — entra primero, sube desde abajo */}
      <div className="foto show-hero-up" style={{ transitionDelay: "3.5s" }}>
        <img className="principal" src={project.hero_photo_url || "/images/esmeralda/foto.jpg"} alt={project.quinceanera_name} />
        <img className="aro-foto" src={aroSrc} alt="" />
        <img className="aro" src={aroGifSrc} alt="" />
      </div>

      {/* Globo de 15 — sube a los pies de la foto */}
      <div className="photo show-hero-up" style={{ marginTop: "-4%", transitionDelay: "4.2s" }}>
        <img className="age" src={numeroSrc} alt="15" />
      </div>

      {/* Frase — entra desde la izquierda */}
      <p className="mensaje texto no-print show-hero-left" style={{ textAlign: "center", transitionDelay: "4.9s" }}>
        {project.invitation_text ||
          "Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida"}
      </p>

      {/* Nombre — entra desde la izquierda */}
      <div className="name show-hero-left" style={{ transitionDelay: "5.6s" }}>
        <img className="tarjet" src={bandaSrc} alt="" />
        <h2 className="person-name" style={{ textAlign: "center" }}>
          {fullName}
        </h2>
      </div>

      {/* Fecha — entra desde la izquierda, última */}
      <h3 id="fecha" className="date texto show-hero-left" style={{ textAlign: "center", margin: "3vw 0", transitionDelay: "6.3s" }}>
        {dateStr}
      </h3>
    </>
  );
}
