import type { Project } from '@/types/invitation'

const FLORES = '/images/bodasobre/flores'

export const PAPEL_DEFAULT = '/images/bodasobre/marmol.jpg'

// Decorativos de flores blancas (camelias, rosas y azahares). Por defecto forman un marco que
// recorre las orillas desde dos esquinas (arriba-izquierda y abajo-derecha); si la invitación
// sube su propia imagen de esquina (decorativo1/2) se usan solo esas, sin guirnaldas.
export function decoracionBoda(project: Project) {
  const extra = project.extra_config ?? {}
  const esquinaSup = (extra.decorativo1_url as string) || ''
  const esquinaInf = (extra.decorativo2_url as string) || ''
  return {
    marco: !esquinaSup && !esquinaInf,
    esquinaSup,
    esquinaInf,
    separador: (extra.decorativo3_url as string) || `${FLORES}/separador.svg`,
  }
}
