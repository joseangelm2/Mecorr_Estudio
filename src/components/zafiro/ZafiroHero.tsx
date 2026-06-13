import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function ZafiroHero({ project }: Props) {
  const [firstName, ...rest] = (project.quinceanera_name ?? "").split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "7vw" }}>Mis XV</h2>
      </div>

      <div className="frase">
        {project.invitation_text ||
          "Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños."}
      </div>

      {project.hero_photo_url && (
        <div className="foto-con-degradado">
          <img className="foto-full" src={project.hero_photo_url} alt={project.quinceanera_name} />
        </div>
      )}

      <img
        className="foto-full show-p-y"
        src="/images/zafiro/corona.png"
        style={{ width: "30%", marginTop: "3%", marginBottom: "-5%" }}
        alt=""
      />

      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "18vw" }}>{firstName}</h2>
        {lastName && <h1 className="evento">{lastName}</h1>}
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas.&rdquo;
      </div>
    </>
  );
}
