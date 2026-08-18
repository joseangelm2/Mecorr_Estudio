import type { Project } from "@/types/invitation";

interface Props {
  project: Project
}

export default function MagicalParents({ project }: Props) {
  const parentsTitle = (project.extra_config?.parents_title as string) || "Mis Padres";
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || "Padrinos";

  return (
    <>
      {project.parent_names?.length > 0 && (
        <section className="parents-container no-print">
          <h2>{parentsTitle}</h2>
          <img className="vector-long" src="/images/magical/separador.png" alt="" />
          <div className="parents texto">
            <p>
              {project.parent_names.map((name, i) => (
                <span key={i}>
                  {name}
                  {i < project.parent_names.length - 1 && <><br />&amp;<br /></>}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}

      {project.padrinos?.length > 0 && (
        <section className="parents-container no-print" style={{ marginTop: "5%" }}>
          <h2>{padrinosTitle}</h2>
          <img className="vector-long" src="/images/magical/separador.png" alt="" />
          <div className="parents texto">
            <p>
              {project.padrinos.map((name, i) => (
                <span key={i}>
                  {name}
                  {i < project.padrinos.length - 1 && <><br />&amp;<br /></>}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
