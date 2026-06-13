import type { Project } from "@/types/invitation";
import ZafiroCountdown from "./ZafiroCountdown";

interface Props {
  project: Project;
}

export default function ZafiroDate({ project }: Props) {
  const d = new Date(project.event_date);
  const day = d.getDate();
  const month = d.toLocaleDateString("es-MX", { month: "long" });
  const year = d.getFullYear();

  return (
    <>
      <div className="frase show" style={{ fontSize: "5.5vw" }}>Celebremos juntos</div>
      <div className="encabezado show" style={{ marginBottom: "-5%" }}>
        <h3 className="evento">El día</h3>
      </div>
      <div className="fecha">
        <p className="dia">{day}</p>
        <div className="barra" />
        <p className="mes" style={{ textTransform: "capitalize" }}>{month}</p>
        <div className="barra" />
        <p className="anio">{year}</p>
      </div>
      <ZafiroCountdown eventDate={project.event_date} />
      <div className="frase show" style={{ fontStyle: "italic" }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables...
      </div>
    </>
  );
}
