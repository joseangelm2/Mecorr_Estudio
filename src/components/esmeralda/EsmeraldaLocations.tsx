export default function EsmeraldaLocations() {
  return (
    <>
      <a
        style={{ marginTop: "5%" }}
        className="lugar show-p-y iglesia"
        href="https://maps.app.goo.gl/EcksAX7GpLbJ1rcN6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="con-foto" src="/images/esmeralda/iglesia.jpg" alt="Iglesia" />
        <h4 className="nombre texto">Parroquia de San Agustín</h4>
        <h4 className="direccion texto">
          Av. Horacio 921, Polanco, Polanco III Secc, Miguel Hidalgo, 11540
          Ciudad de México, CDMX
        </h4>
        <div className="button no-print">Ir al Mapa</div>
        <h5 className="texto hora">05:00 PM</h5>
      </a>

      <a
        style={{ marginTop: "-5%" }}
        className="lugar show-p-y"
        href="https://maps.app.goo.gl/W9nyTQnkuP9LxSf39"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="con-foto" src="/images/esmeralda/evento.jpg" alt="Evento" />
        <h4 className="nombre texto">Salón Los Candiles Polanco</h4>
        <h4 className="direccion texto">
          Av. Ejército Nacional Mexicano 613-Mezzanine, Granada, Miguel
          Hidalgo, 11520 Ciudad de México, CDMX
        </h4>
        <div className="button no-print">Ir al Mapa</div>
        <h5 className="texto hora">07:00 PM</h5>
      </a>
    </>
  );
}
