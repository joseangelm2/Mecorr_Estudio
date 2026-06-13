import type { Project } from "@/types/invitation";

interface Props { project: Project }

export default function PinkHero({ project }: Props) {
  const [firstName, ...rest] = (project.quinceanera_name ?? "").split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
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

      <div className="encabezado">
        <h2 className="nombre-principal">{firstName}</h2>
        {lastName && <h1 className="evento">{lastName}</h1>}
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas.&rdquo;
      </div>
    </>
  );
}
