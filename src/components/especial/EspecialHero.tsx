import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EspecialHero({ project }: Props) {
  const heroPhoto = project.hero_photo_url ?? '/images/IMG_8201.JPG'
  const invitationText = project.invitation_text ??
    'Con mucho cariño te invitamos a compartir este día tan especial.'

  return (
    <section id="portada" className="padding-section text-center">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src="/images/flores-01.png" width="160" alt="" />
          </div>
          <h1 className="titulo color-titulos mb-20 wow fadeInUp">
            {project.quinceanera_name}
          </h1>
          {heroPhoto && (
            <img
              src={heroPhoto}
              alt={project.quinceanera_name}
              width="100%"
              className="wow fadeInUp"
              style={{ borderRadius: '8px', marginBottom: '20px' }}
            />
          )}
          <p className="color-textos wow fadeInUp" style={{ whiteSpace: 'pre-line' }}>
            {invitationText}
          </p>
        </div>
      </div>
    </section>
  )
}
