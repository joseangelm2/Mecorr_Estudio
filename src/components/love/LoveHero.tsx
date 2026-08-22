import type { Project } from "@/types/invitation";
import LoveCountdown from "./LoveCountdown";

interface Props {
  project: Project;
}

export default function LoveHero({ project }: Props) {
  const MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const d = new Date(project.event_date);
  const dateStr = `${d.getDate()}.${MONTHS[d.getMonth()]}.${d.getFullYear()}`;
  const [firstName] = (project.quinceanera_name ?? "").split(" ");

  const bgStyle = project.hero_photo_url
    ? { backgroundImage: `url(${project.hero_photo_url})`, backgroundSize: "cover", backgroundPosition: "center top" }
    : {};

  return (
    <section id="portada" className="parallax-container parallax-1" style={bgStyle}>
      <div className="hero-container">
        <div className="nombre">
          <h2 className="nombre-titulo">{firstName}</h2>
        </div>
        <div className="date fecha-text">
          <h3>{dateStr}</h3>
        </div>
        <div className="time">
          <LoveCountdown eventDate={project.event_date} />
        </div>
      </div>
    </section>
  );
}
