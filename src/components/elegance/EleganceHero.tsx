import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EleganceHero({ project }: Props) {
  const heroPhoto = project.hero_photo_url ?? '/images/elegance/foto.jpg'
  const invitationText = project.invitation_text ??
    'Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas. Quisiera que estés presente en uno de los días más inolvidables de mi vida.'

  const nameParts = project.quinceanera_name.trim().split(' ')
  const firstName = nameParts[0]
  const lastNames = nameParts.slice(1).join(' ')

  return (
    <>
      <div style={{ display: 'grid', width: '70%', margin: '3% auto -3%' }}>
        <img src="/images/elegance/Logo.png" style={{ gridArea: '1/1', width: '100%', display: 'block' }} alt="" />
        <div style={{
          gridArea: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "var(--font-dancing, 'Dancing Script', cursive)",
          fontSize: '32vw',
          fontWeight: 700,
          lineHeight: 1,
          background: 'linear-gradient(180deg, #fffbe0 0%, #f5c842 12%, #c8880c 28%, #ffd700 44%, #7a4e00 56%, #e8a800 68%, #b8780a 80%, #ffe585 92%, #c89010 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.45)) drop-shadow(0px 1px 0px rgba(80,40,0,0.6))',
        }}>
          {firstName[0].toUpperCase()}
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full" src={heroPhoto} alt={project.quinceanera_name} />
      </div>

      <img
        className="foto-full"
        src="/images/elegance/Papel.png"
        style={{ width: '100%', marginTop: '3%', marginBottom: '-110%' }}
        alt=""
      />

      <div className="encabezado">
        <h2 className="nombre-principal">{firstName}</h2>
        {lastNames && <h1 className="evento">{lastNames}</h1>}
      </div>

      <div className="frase show" style={{ marginTop: '2%', marginBottom: '30%', color: '#BA8100' }}>
        {invitationText}
      </div>
    </>
  )
}
