import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function EsmeraldaParents({ project }: Props) {
  const parents = project.parent_names.filter(Boolean);
  const padrinos = project.padrinos.filter(Boolean);
  const parentsTitle = (project.extra_config?.parents_title as string) || "Mis Padres";
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || "Padrinos";

  if (!parents.length && !padrinos.length) return null;

  return (
    <>
      {parents.length > 0 && (
        <section className="parents-container no-print">
          <h2>{parentsTitle}</h2>
          <img className="vector-long" src="/images/esmeralda/9_separador.png" alt="" />
          <div className="parents texto">
            <p>
              {parents.map((n, i) => (
                <span key={i}>
                  {n}
                  {i < parents.length - 1 && <><br /> &amp; <br /></>}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}

      {padrinos.length > 0 && (
        <section className="parents-container no-print" style={{ marginTop: "5%" }}>
          <h2>{padrinosTitle}</h2>
          <img className="vector-long" src="/images/esmeralda/9_separador.png" alt="" />
          <div className="parents texto">
            <p>
              {padrinos.map((n, i) => (
                <span key={i}>
                  {n}
                  {i < padrinos.length - 1 && <><br />y<br /></>}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
