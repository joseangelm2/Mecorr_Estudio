import type { Project } from "@/types/invitation";
import { decoracionBoda } from "@/lib/bodasobre-deco";

// Adornos de esquina: solo se muestran las imágenes de esquina que suba la invitación.
export default function BodaSobreMarco({ project, portada = false }: { project: Project; portada?: boolean }) {
  const d = decoracionBoda(project);

  if (!d.marco) {
    return (
      <>
        {d.esquinaSup && <img className={`bs-deco-esquina bs-deco-sup${portada ? " bs-deco-portada" : ""}`} src={d.esquinaSup} alt="" />}
        {d.esquinaInf && <img className={`bs-deco-esquina bs-deco-inf${portada ? " bs-deco-portada" : ""}`} src={d.esquinaInf} alt="" />}
      </>
    );
  }

  // Sin esquinas propias no se dibuja ningún adorno en los bordes.
  return null;
}
