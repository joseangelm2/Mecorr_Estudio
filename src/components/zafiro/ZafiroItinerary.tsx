import type { Project } from "@/types/invitation";

const DEFAULT_EVENTS = [
  { description: "Misa",           time: "05:00 PM", icon: "iglesia.png" },
  { description: "Recepción",      time: "07:00 PM", icon: "recepcion.png" },
  { description: "Coctelería",     time: "08:00 PM", icon: "coctel.png" },
  { description: "Cena",           time: "09:00 PM", icon: "comida.png" },
  { description: "Vals",           time: "10:20 PM", icon: "vals.png" },
  { description: "Baile",          time: "11:30 PM", icon: "baile.png" },
  { description: "Fin del Evento", time: "03:00 AM", icon: "fin.png" },
];

interface Props {
  project: Project;
}

export default function ZafiroItinerary({ project }: Props) {
  if (!project.show_itinerary || !project.itinerary.length) return null;

  const events = project.itinerary.map((e, i) => ({
    ...e,
    icon: e.icon || DEFAULT_EVENTS[i % DEFAULT_EVENTS.length]?.icon || "iglesia.png",
  }));

  return (
    <div className="itinerario show-p-y">
      <h3>Programa del Evento</h3>
      <div style={{ width: "100%" }}>
        {events.map((ev, i) => {
          const side = i % 2 === 0 ? "izquierda" : "derecha";
          const iconSrc =
            ev.icon?.startsWith("http") || ev.icon?.startsWith("/")
              ? ev.icon
              : `/images/zafiro/${ev.icon}`;

          return (
            <div key={i} className={`evento ${side}`} style={i === 0 ? { marginTop: "4vw" } : undefined}>
              {side === "izquierda" ? (
                <>
                  <div className="icono show-n-x">
                    <div className="circulo"><img src={iconSrc} alt={ev.description} /></div>
                  </div>
                  <div className="item show-p-x">
                    <h4 className="nombre">{ev.description}</h4>
                    <p className="hora">{ev.time}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="item show-n-x">
                    <h4 className="nombre">{ev.description}</h4>
                    <p className="hora">{ev.time}</p>
                  </div>
                  <div className="icono show-p-x">
                    <div className="circulo"><img src={iconSrc} alt={ev.description} /></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
