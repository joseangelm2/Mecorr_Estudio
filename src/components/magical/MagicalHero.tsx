import type { Project } from "@/types/invitation";

interface Props {
  project: Project
}

export default function MagicalHero({ project }: Props) {
  const eventDate = new Date(project.event_date);
  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = (eventDate.getMonth() + 1).toString().padStart(2, "0");
  const year = eventDate.getFullYear();
  const dateStr = `${day}.${month}.${year}`;

  const firstName = project.quinceanera_name.split(" ")[0];

  return (
    <>
      <h1 className="event texto" style={{ textAlign: "center", marginTop: "5vw" }}>
        ✨ Mis XV ✨
      </h1>

      <div className="foto">
        <img className="principal" src={project.hero_photo_url ?? "/images/magical/foto.jpg"} alt="Quinceañera" />
        <img className="aro-foto" src="/images/magical/aro.png" alt="" />
        <img className="aro" src="/images/magical/aro.gif" alt="" />
      </div>

      <div className="photo" style={{ marginTop: "-4%" }}>
        <img className="age" src="/images/magical/15.png" alt="15" />
      </div>

      <p className="mensaje texto no-print" style={{ textAlign: "center" }}>
        &ldquo;{project.invitation_text ?? "La magia no está en los sueños, sino en quienes los hacen realidad. Hoy, tú eres parte de mi magia"}&rdquo;
      </p>

      <div className="name">
        <img className="tarjet" src="/images/magical/banda.png" alt="" />
        <h2 className="person-name" style={{ textAlign: "center" }}>
          {firstName}
        </h2>
      </div>

      <h3 id="fecha" className="date texto" style={{ textAlign: "center", margin: "3vw 0" }}>
        {dateStr}
      </h3>
    </>
  );
}
