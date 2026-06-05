const events = [
  { name: "Misa", time: "05:00 PM", icon: "/images/esmeralda/misa.png", side: "izquierda" },
  { name: "Recepción", time: "07:00 PM", icon: "/images/esmeralda/recepcion.png", side: "derecha" },
  { name: "Coctelería", time: "08:00 PM", icon: "/images/esmeralda/coctel.png", side: "izquierda" },
  { name: "Cena", time: "09:00 PM", icon: "/images/esmeralda/comida.png", side: "derecha" },
  { name: "Vals", time: "10:20 PM", icon: "/images/esmeralda/vals.png", side: "izquierda" },
  { name: "Baile", time: "11:30 PM", icon: "/images/esmeralda/baile.png", side: "derecha" },
  { name: "Fin del Evento", time: "03:00 AM", icon: "/images/esmeralda/fin.png", side: "izquierda" },
] as const;

export default function EsmeraldaItinerario() {
  return (
    <div className="itinerario show-p-y no-print" style={{ marginTop: "-3%" }}>
      <h2>Programa del Evento</h2>
      <div>
        {events.map((ev, i) => (
          <div key={i} className={`evento ${ev.side}`} style={i === 0 ? { marginTop: "0" } : undefined}>
            {ev.side === "izquierda" ? (
              <>
                <div className="icono show-n-x">
                  <div className="circulo">
                    <img src={ev.icon} className="invertir-img-itinerario" alt={ev.name} />
                  </div>
                </div>
                <div className="item show-p-x">
                  <h4 className="nombre texto">{ev.name}</h4>
                  <p className="hora texto">{ev.time}</p>
                </div>
              </>
            ) : (
              <>
                <div className="item show-n-x">
                  <h4 className="nombre texto">{ev.name}</h4>
                  <p className="hora texto">{ev.time}</p>
                </div>
                <div className="icono show-p-x">
                  <div className="circulo">
                    <img src={ev.icon} className="invertir-img-itinerario" alt={ev.name} />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
