import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EspecialParents({ project }: Props) {
  const parentsTitle  = (project.extra_config?.parents_title  as string) || 'Con la bendición de mis Padres'
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || 'Y el apoyo de mis Padrinos'

  const hasParents  = project.parent_names?.length > 0
  const hasPadrinos = project.padrinos?.length > 0

  if (!hasParents && !hasPadrinos) return null

  return (
    <section className="padding-section text-center">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src="/images/flores-01.png" width="100" alt="" />
          </div>

          {hasParents && (
            <>
              <h2 className="titulo color-titulos mb-20 wow fadeInUp">{parentsTitle}</h2>
              <div className="wow fadeInUp">
                {project.parent_names.map((name, i) => (
                  <p key={i} className="color-textos sombra mb-10">{name}</p>
                ))}
              </div>
            </>
          )}

          {hasPadrinos && (
            <>
              <h2 className="titulo color-titulos mb-20 wow fadeInUp" style={{ marginTop: '30px' }}>{padrinosTitle}</h2>
              <div className="wow fadeInUp">
                {project.padrinos.map((name, i) => (
                  <p key={i} className="color-textos sombra mb-10">{name}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
