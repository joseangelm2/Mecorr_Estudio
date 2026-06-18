import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EleganceParents({ project }: Props) {
  const parentsTitle  = (project.extra_config?.parents_title  as string) || 'Mis Padres'
  const padrinosTitle = (project.extra_config?.padrinos_title as string) || 'Mis Padrinos'

  return (
    <>
      <img
        className="foto-full show-p-y"
        src="/images/elegance/cenicienta3.png"
        style={{ width: '35%', marginTop: '3%', marginBottom: '-3%', filter: 'var(--img-filter, none)' }}
        alt=""
      />

      {project.parent_names?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: '5.5vw', marginBottom: '-3%' }}>
            Con la bendición de Dios y de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: 'italic' }}>{parentsTitle}</h3>
            {project.parent_names.flatMap((name, i) => [
              i > 0 ? <p key={`sp${i}`} className="nombre">&amp;</p> : null,
              <p key={i} className="nombre">{name}</p>,
            ])}
          </div>
        </>
      )}

      {project.padrinos?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: '5.5vw' }}>
            Y la compañía de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: 'italic' }}>{padrinosTitle}</h3>
            {project.padrinos.flatMap((name, i) => [
              i > 0 ? <p key={`sp${i}`} className="nombre">&amp;</p> : null,
              <p key={i} className="nombre">{name}</p>,
            ])}
          </div>
        </>
      )}
    </>
  )
}
