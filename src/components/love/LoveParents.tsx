import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function LoveParents({ project }: Props) {
  const hasParents = project.parent_names.filter(Boolean).length > 0;
  const hasPadrinos = project.padrinos.filter(Boolean).length > 0;
  const parentsTitle = (project.extra_config?.parents_title as string) || "Mis Padres";
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || "Padrinos";

  if (!hasParents && !hasPadrinos) return null;

  return (
    <div id="familia" className="contain">
      <div className="familiares">
        {hasParents && (
          <section className="parents-container show-n-x">
            <h2 className="subtitulo">{parentsTitle}</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="parents">
              <p className="texto">
                {project.parent_names
                  .filter(Boolean)
                  .join("\n&\n")
                  .split("\n")
                  .map((t, i) => (
                    <span key={i}>{t === "&" ? <> &amp; </> : t}<br /></span>
                  ))}
              </p>
            </div>
          </section>
        )}

        {hasPadrinos && (
          <section className="parents-container show-p-x" style={{ marginTop: "10%", marginBottom: "5%" }}>
            <h2 className="subtitulo">{padrinosTitle}</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="parents">
              <p className="texto">
                {project.padrinos
                  .filter(Boolean)
                  .join("\n&\n")
                  .split("\n")
                  .map((t, i) => (
                    <span key={i}>{t === "&" ? <> &amp; </> : t}<br /></span>
                  ))}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
