import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EspecialFooter({ project }: Props) {
  const footerText = (project.extra_config?.footer_text as string) || '¡Te Esperamos!'

  return (
    <section
      className="padding-final text-center bg-img bg-overlay-contador"
      style={{ backgroundImage: 'var(--inv-bg-url, url(/images/background-mob.jpg))' }}
    >
      <div className="row justify-content-center">
        <div className="col-md-10">
          {project.hero_photo_url && (
            <img
              src={project.hero_photo_url}
              alt={project.quinceanera_name}
              width="100%"
              className="wow fadeInUp"
              style={{ borderRadius: '8px', marginBottom: '20px' }}
            />
          )}
          <h2 className="titulo text-white wow fadeInUp" style={{ wordSpacing: '0.3em' }}>{project.quinceanera_name}</h2>
          <p className="text-white texto-frase" style={{ marginTop: '16px' }}>
            {footerText}
          </p>
        </div>
      </div>
    </section>
  )
}
