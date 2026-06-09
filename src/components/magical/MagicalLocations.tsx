export default function MagicalLocations() {
  return (
    <>
      <a
        style={{ marginTop: "5%", marginBottom: "5%" }}
        className="lugar show-p-y iglesia"
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="con-foto" src="/images/magical/iglesia.jpg" alt="Iglesia" />
        <h4 className="nombre texto">La Catedral</h4>
        <h4 className="direccion texto">
         Calle Principal 123, Ciudad de México, CDMX
        </h4>
        <div className="button no-print">Ir al Mapa</div>
        <h5 className="texto hora">05:00 PM</h5>
      </a>

      <a
        style={{ marginTop: "0", marginBottom: "5%" }}
        className="lugar show-p-y"
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="con-foto" src="/images/magical/evento.jpg" alt="Salón" />
        <h4 className="nombre texto">Salón Galeria</h4>
        <h4 className="direccion texto">
          Madero 456, Ciudad de México, CDMX
        </h4>
        <div className="button no-print">Ir al Mapa</div>
        <h5 className="texto hora">07:00 PM</h5>
      </a>
    </>
  );
}
