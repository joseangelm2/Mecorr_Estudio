import type { Project } from '@/types/invitation'
import DressCodePalette from '@/components/DressCodePalette'

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialDressCode({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const showPalette = project.extra_config?.show_dress_palette === true

  if (!project.dress_code && !showPalette) return null

  return (
    <section id="vestimenta" className="padding-section text-center" style={{ paddingBottom: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Código de Vestimenta</h2>
          {project.dress_code?.colors && (
            <p className="color-textos mb-20 wow fadeInUp">{project.dress_code.colors}</p>
          )}
          <DressCodePalette project={project} />
          {project.dress_code?.notes && (
            <p className="color-textos mb-20 wow fadeInUp" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{project.dress_code.notes}</p>
          )}
        </div>
      </div>
    </section>
  )
}
