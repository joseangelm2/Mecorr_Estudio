import type { Project } from "@/types/invitation";
import { decoracionBoda } from "@/lib/bodasilueta-deco";

const FLORES = "/images/bodasilueta/flores";

// Marco de flores: un racimo en cada esquina y una guirnalda que corre por los dos bordes
// (entre un tercio y media pantalla). Arriba-izquierda y abajo-derecha (la segunda es la primera
// girada 180°). Si la invitación sube sus propias esquinas, se colocan tal cual.
export default function BodaSiluetaMarco({ project, portada = false }: { project: Project; portada?: boolean }) {
  const d = decoracionBoda(project);
  const clase = `bs-marco${portada ? " bs-marco--portada" : ""}`;

  if (!d.marco) {
    return (
      <>
        {d.esquinaSup && <img className={`bs-deco-esquina bs-deco-sup${portada ? " bs-deco-portada" : ""}`} src={d.esquinaSup} alt="" />}
        {d.esquinaInf && <img className={`bs-deco-esquina bs-deco-inf${portada ? " bs-deco-portada" : ""}`} src={d.esquinaInf} alt="" />}
      </>
    );
  }

  const esquina = (
    <>
      <img className="bs-marco-racimo" src={`${FLORES}/esquina-sup.svg`} alt="" />
      <i className="bs-marco-h" />
      <i className="bs-marco-v" />
    </>
  );

  return (
    <>
      <div className={`${clase} bs-marco--sup`} aria-hidden="true">{esquina}</div>
      <div className={`${clase} bs-marco--inf`} aria-hidden="true">{esquina}</div>
    </>
  );
}
