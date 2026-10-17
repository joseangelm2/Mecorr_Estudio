import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function EsmeraldaParents({ project }: Props) {
  const parents = project.parent_names.filter(Boolean);
  const padrinos = project.padrinos.filter(Boolean);
  const parentsTitle = (project.extra_config?.parents_title as string) || "Mis Padres";
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || "Padrinos";
  const separadorSrc = (project.extra_config?.separador_url as string) || "/images/esmeralda/9_separador.png";

  if (!parents.length && !padrinos.length) return null;

  // Esmeralda Especial: sin separador bajo cada título; un solo separador entre
  // padres y padrinos (con aire propio para no encimarse con el título de
  // padrinos) y "&" en vez de "y" entre padrinos.
  const especial = project.template === "esmeralda-especial";

  return (
    <>
      {parents.length > 0 && (
        <section className="parents-container no-print">
          <h2>{parentsTitle}</h2>
          {!especial && <img className="vector-long" src={separadorSrc} alt="" />}
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

      {especial && parents.length > 0 && padrinos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", margin: "7vw 0 5vw" }}>
          <img className="vector-long" style={{ marginTop: 0 }} src={separadorSrc} alt="" />
        </div>
      )}

      {padrinos.length > 0 && (
        <section className="parents-container no-print" style={especial ? undefined : { marginTop: "5%" }}>
          <h2>{padrinosTitle}</h2>
          {!especial && <img className="vector-long" src={separadorSrc} alt="" />}
          <div className="parents texto">
            <p>
              {padrinos.map((n, i) => (
                <span key={i}>
                  {n}
                  {i < padrinos.length - 1 && (especial ? <><br /> &amp; <br /></> : <><br />y<br /></>)}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
