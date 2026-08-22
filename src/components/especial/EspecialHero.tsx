import type { Project } from '@/types/invitation'

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialHero({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const heroPhoto = project.hero_photo_url ?? '/images/IMG_8201.JPG'
  const invitationText = project.invitation_text ??
    'Con mucho cariño te invitamos a compartir este día tan especial.'

  return (
    <section id="portada" className="padding-section text-center" style={{ paddingBottom: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="titulo color-titulos mb-20 wow fadeInUp" style={{ fontSize: '36px', letterSpacing: '6px' }}>
            Mis XV Años
          </h2>
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="160" alt="" />
          </div>
          <h1 className="titulo color-titulos mb-20 wow fadeInUp" style={{ wordSpacing: '0.3em' }}>
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
          <p className="color-textos texto-frase wow fadeInUp" style={{ whiteSpace: 'pre-line' }}>
            {invitationText}
          </p>
        </div>
      </div>
    </section>
  )
}
