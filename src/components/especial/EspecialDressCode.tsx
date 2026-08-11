import type { Project } from '@/types/invitation'

interface DressPaletteEntry {
  name: string
  colors: string[]
}

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialDressCode({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const showPalette = project.extra_config?.show_dress_palette === true
  const palette = (project.extra_config?.dress_palette as DressPaletteEntry[] | undefined) ?? []
  const dressCodeImageUrl = (project.extra_config?.dress_code_image_url as string) || null

  if (!project.dress_code && !showPalette) return null

  return (
    <section className="padding-section text-center" style={{ paddingBottom: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Código de Vestimenta</h2>
          {project.dress_code?.colors && (
            <p className="color-textos mb-20 wow fadeInUp">{project.dress_code.colors}</p>
          )}
          {showPalette && palette.length > 0 && (
            <div
              className="wow fadeInUp"
              style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}
            >
              {palette.map((entry, i) => {
                const bg = entry.colors.length === 1
                  ? entry.colors[0]
                  : `linear-gradient(to right, ${entry.colors.join(', ')})`
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: bg,
                        border: '2px solid rgba(0,0,0,0.1)',
                        flexShrink: 0,
                      }}
                    />
                    <span className="color-textos" style={{ fontSize: '12px', maxWidth: '70px', textAlign: 'center' }}>
                      {entry.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          {dressCodeImageUrl && (
            <div className="wow fadeInUp" style={{ marginTop: '24px' }}>
              <img
                src={dressCodeImageUrl}
                alt="Referencia de vestimenta"
                style={{ maxWidth: '100%', borderRadius: '12px' }}
              />
            </div>
          )}
          {project.dress_code?.notes && (
            <p className="color-textos mb-30 wow fadeInUp" style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '40px' }}>{project.dress_code.notes}</p>
          )}
        </div>
      </div>
    </section>
  )
}
