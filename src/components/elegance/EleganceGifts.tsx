import type { Project } from '@/types/invitation'

interface Props {
  project: Project
}

export default function EleganceGifts({ project }: Props) {
  return (
    <>
      {project.gift_registry?.liverpoolLink && (
        <a className="extra show-p-y" href={project.gift_registry.liverpoolLink} target="_self">
          <img style={{ width: '50%', marginBottom: '3%' }} src="/images/elegance/liverpool.png" alt="Liverpool" />
          <h3>Mesa de Regalos</h3>
          <p className="texto">Tu presencia ilumina nuestro evento. Si deseas regalarme algo, te comparto las siguientes opciones:</p>
          <div className="boton" style={{ marginTop: '1%' }}>Ver Lista de Deseos</div>
        </a>
      )}

      {project.show_lluvia_sobres && (
        <div className="extra show-p-y">
          <img src="/images/elegance/sobre.png" style={{ width: '25%' }} alt="Sobre" />
          <h3>Lluvia de Sobres</h3>
          <p className="texto">
            {project.lluvia_sobres_text || 'Es la tradición de regalar dinero en efectivo dentro de un sobre.'}
          </p>
        </div>
      )}

      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div className="extra show-p-y">
          <img src="/images/elegance/mesa_regalos.png" style={{ width: '20%', marginBottom: '3%' }} alt="Transferencia" />
          <h3>Datos Bancarios</h3>
          <p className="texto">
            {project.datos_bancarios_text || 'No es necesario estar cerca, para hacer sentir el amor y el cariño... Así que si lo prefieres puedes hacer una transferencia bancaria:'}
          </p>
          <div className="texto" style={{ marginTop: '2%' }}>
            <p><b>Cuenta:</b> {project.gift_registry.bankAccount}</p>
            {project.gift_registry.bankBeneficiary && (
              <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
            )}
          </div>
        </div>
      )}

      {project.dress_code && (
        <div className="extra show-p-y">
          <img src="/images/elegance/vestimenta.png" style={{ width: '30%', marginBottom: '3%' }} alt="Vestimenta" />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors}</p>
        </div>
      )}
    </>
  )
}
