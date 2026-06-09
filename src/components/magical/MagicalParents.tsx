export default function MagicalParents() {
  return (
    <>
      <section className="parents-container no-print">
        <h2>Mis Padres</h2>
        <img className="vector-long" src="/images/magical/separador.png" alt="" />
        <div className="parents texto">
          <p>Juan Domingo de la Fuente<br />&amp;<br />Cristina Pérez</p>
        </div>
      </section>

      <section className="parents-container no-print" style={{ marginTop: "5%" }}>
        <h2>Padrinos</h2>
        <img className="vector-long" src="/images/magical/separador.png" alt="" />
        <div className="parents texto">
          <p>Carlos Rodríguez<br />y<br />María González</p>
        </div>
      </section>
    </>
  );
}
