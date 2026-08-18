import type { Project } from "@/types/invitation";

interface Props { project: Project }

export default function PinkParents({ project }: Props) {
  const hasParents = project.parent_names.filter(Boolean).length > 0;
  const hasPadrinos = project.padrinos.filter(Boolean).length > 0;
  const parentsTitle = (project.extra_config?.parents_title as string) || "Mis Padres";
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || "Mis Padrinos";
  if (!hasParents && !hasPadrinos) return null;

  return (
    <>
      {hasParents && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>
            Con la bendición de Dios y de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>{parentsTitle}</h3>
            {project.parent_names.filter(Boolean).map((n, i, arr) => (
              <span key={i}>
                <p className="nombre">{n}</p>
                {i < arr.length - 1 && <p className="nombre">&amp;</p>}
              </span>
            ))}
          </div>
        </>
      )}
      {hasPadrinos && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>Y la compañía de</div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>{padrinosTitle}</h3>
            {project.padrinos.filter(Boolean).map((n, i, arr) => (
              <span key={i}>
                <p className="nombre">{n}</p>
                {i < arr.length - 1 && <p className="nombre">&amp;</p>}
              </span>
            ))}
          </div>
        </>
      )}
    </>
  );
}
